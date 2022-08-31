
from datetime import datetime
from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc
from Cheese.cheeseRepository import CheeseRepository as cr

from src.repositories.eventsRepository import EventsRepository
from src.repositories.clubsRepository import ClubsRepository
from src.repositories.registeredClubsRepository import RegisteredClubsRepository

from src.repositories.bills.billsRepository import BillsRepository
from src.repositories.bills.billItemsRepository import BillItemsRepository
from src.repositories.bills.billRoomsRepository import BillRoomsRepository
from src.repositories.bills.billPackagesRepository import BillPackagesRepository
from src.repositories.bills.billChangeCommentsRepository import BillChangeCommentsRepository

from src.other.billCalculator import BillCalculator
from src.other.billCreator import BillCreator
from src.other.pdfCreator import PdfCreator

#@controller /bills;
class BillsController(cc):

    #@get /getBillData;
    @staticmethod
    def getBillData(server, path, auth):
        args = cc.getArgs(path)
        cc.checkJson(["eventId", "regClubId"], args)
        
        bad, bpd, bsd, event, club = BillsController.prepareDataFromDb(args)

        return cc.createResponse({"BAD": bad, "BPD": bpd, "BSD": bsd})

    #@get /getBillXlsx;
    @staticmethod
    def getBillXlsx(server, path, auth):
        args = cc.getArgs(path)
        cc.checkJson(["eventId", "regClubId"], args)

        data = BillsController.prepareDataFromDb(args)
        billName = BillCreator.createXlsx(*data)

        return cc.createResponse({"BILL": billName})

    #@get /getBillPdf;
    @staticmethod
    def getBillPdf(server, path, auth):
        args = cc.getArgs(path)
        cc.checkJson(["eventId", "regClubId"], args)

        data = BillsController.prepareDataFromDb(args)
        billName = BillCreator.createPdf(*data)

        return cc.createResponse({"BILL": billName})

    #@post /postBillXlsx;
    @staticmethod
    def postBillXlsx(server, path, auth):
        args = cc.readArgs(server)

        cc.checkJson(["JBS", "ARRIVALS", "DEPARTS", "EVENT_ID"], args)

        if (len(args["JBS"]) == 0):
            raise BadRequest("There not any people")

        event = EventsRepository.find(args["EVENT_ID"])
        club = ClubsRepository.find(args["JBS"][0]["CLUB_ID"])

        bad, bpd, bsd = BillCalculator.getCalculatedBillData(args)

        billName = BillCreator.createXlsx(bad, bpd, bsd, event, club)

        return cc.createResponse({"BILL": billName})

    #@post /postBillPdf;
    @staticmethod
    def postBillPdf(server, path, auth):
        args = cc.readArgs(server)

        cc.checkJson(["JBS", "ARRIVALS", "DEPARTS", "EVENT_ID"], args)

        if (len(args["JBS"]) == 0):
            raise BadRequest("There not any people")

        event = EventsRepository.find(args["EVENT_ID"])
        club = ClubsRepository.find(args["JBS"][0]["CLUB_ID"])

        bad, bpd, bsd = BillCalculator.getCalculatedBillData(args)

        billName = BillCreator.createPdf(bad, bpd, bsd, event, club)

        return cc.createResponse({"BILL": billName})
    
    #@get /comments;
    @staticmethod
    def comments(server, path, auth):
        args = cc.getArgs(path)
        cc.checkJson(["eventId", "regClubId"], args)

        billModel = BillsRepository.findByEventAndRegClub(args["eventId"], args["regClubId"])
        comments = BillChangeCommentsRepository.findWhere(bill_item_id=billModel.id)

        return cc.createResponse({"COMMENTS": cc.modulesToJsonArray(comments)})

    #@post /recalculate;
    @staticmethod
    def recalculate(server, path, auth):
        args = cc.readArgs(server)
        cc.checkJson(["EVENT_ID", "REG_CLUB_ID", "COMMENT", "BAD", "BPD", "BSD"], args)

        billModel = BillsRepository.findByEventAndRegClub(args["EVENT_ID"], args["REG_CLUB_ID"])
        billItems = BillItemsRepository.findWhere(bill_id=billModel.id)
        
        acc = None
        pack = None
        for item in billItems:
            if (item.name == "Accommodation"): acc = item
            if (item.name == "Packages"): pack = item

        billRooms = BillRoomsRepository.findWhere(bill_item_id=acc.id)
        billPackages = BillPackagesRepository.findWhere(bill_item_id=pack.id)

        cr.disableAutocommit()
        try:
            commentModel = BillChangeCommentsRepository.model()
            commentModel.setAttrs(
                bill_item_id=billModel.id,
                comment=args["COMMENT"],
                datum=datetime.now()
            )
            BillChangeCommentsRepository.save(commentModel)

            roomTotal = 0
            for room in billRooms:
                newRoom = BillsController.getItemById(room.id, args["BAD"]["ROOMS"])
                room.toModel(newRoom)

                room.start_date = BillsController.convertToDate(room.start_date)
                room.end_date = BillsController.convertToDate(room.end_date)

                room.nights = int((room.end_date - room.start_date).days)
                room.total = room.price_ro * room.nights * room.count_room # zase nevim jestli count_room nebo count_people
                roomTotal += room.total
                BillRoomsRepository.update(room)
            
            packageTotal = 0
            for package in billPackages:
                newPackage = BillsController.getItemById(package.id, args["BPD"]["PACKAGES"])
                package.toModel(newPackage)

                package.start_date = BillsController.convertToDate(package.start_date)
                package.end_date = BillsController.convertToDate(package.end_date)

                package.nights = int((package.end_date - package.start_date).days)
                package.total = package.price * package.nights * package.count_people
                packageTotal += package.total
                BillPackagesRepository.update(package)

            acc.price = roomTotal
            pack.price = packageTotal

            sumTotal = 0
            for item in billItems:
                item.total = item.price * item.number
                sumTotal += item.total
                BillItemsRepository.update(item)

            billModel.total = sumTotal
            BillsRepository.update(billModel)

            cr.commit()
        except Exception as e:
            cr.enableAutocommit()
            raise e
        cr.enableAutocommit()

        return cc.createResponse({"STATUS": "Recalculated"})

    #@get /generateEventPdf;
    @staticmethod
    def generateEventPdf(server, path, auth):
        args = cc.getArgs(path)
        cc.checkJson(["eventId"], args)

        return cc.createResponse({"PDF": PdfCreator.createPdf(args["eventId"])})

    # METHODS

    @staticmethod
    def convertToDate(obj):
        if (type(obj) is str):
            return datetime.strptime(obj, "%Y-%m-%d")
        return obj

    @staticmethod
    def getItemById(id, array):
        for item in array:
            if (item["id"] == id): return item

    @staticmethod
    def prepareDataFromDb(args):
        event = EventsRepository.find(args["eventId"])
        regClub = RegisteredClubsRepository.find(args["regClubId"])
        club = ClubsRepository.find(regClub.club_id)

        billModel = BillsRepository.findByEventAndRegClub(args["eventId"], args["regClubId"])
        billItems = BillItemsRepository.findWhere(bill_id=billModel.id)
        
        acc = None
        pack = None
        for item in billItems:
            if (item.name == "Accommodation"): acc = item
            if (item.name == "Packages"): pack = item

        billRooms = BillRoomsRepository.findWhere(bill_item_id=acc.id)
        billPackages = BillPackagesRepository.findWhere(bill_item_id=pack.id)

        bsd = {
            "ITEMS": cc.modulesToJsonArray(billItems, True, False),
            "total": billModel.total
        }
        bad = {
            "ROOMS": cc.modulesToJsonArray(billRooms, True, False),
            "total": acc.total
        }
        bpd = {
            "PACKAGES": cc.modulesToJsonArray(billPackages, True, False),
            "total": pack.total
        }

        return bad, bpd, bsd, event, club

    @staticmethod
    def saveBill(args):
        event = EventsRepository.find(args["EVENT_ID"])
        reg_club = RegisteredClubsRepository.registeredClubInEvent(event.id, args["JBS"][0]["CLUB_ID"])

        bad, bpd, bsd = BillCalculator.getCalculatedBillData(args)

        billModel = BillsRepository.model()
        billModel.setAttrs(
            event_id=event.id,
            reg_club_id=reg_club.id,
            total=bsd["total"]
        )
        BillsRepository.save(billModel)

        bill_rooms_id = None
        bill_packages_id = None
        i = 0
        for item in bsd["ITEMS"]:
            itemModel = BillItemsRepository.model(i)
            itemModel.setAttrs(bill_id=billModel.id)
            itemModel.toModel(item)

            if (itemModel.name == "Accommodation"): bill_rooms_id = itemModel.id
            elif (itemModel.name == "Packages"): bill_packages_id = itemModel.id

            BillItemsRepository.save(itemModel)
            i += 1

        i = 0
        for room in bad["ROOMS"]:
            roomModel = BillRoomsRepository.model(i)
            roomModel.setAttrs(bill_item_id=bill_rooms_id)
            roomModel.toModel(room)

            BillRoomsRepository.save(roomModel)
            i += 1

        i = 0
        for package in bpd["PACKAGES"]:
            packageModel = BillPackagesRepository.model(i)
            packageModel.setAttrs(bill_item_id=bill_packages_id)
            packageModel.toModel(package)

            BillPackagesRepository.save(packageModel)
            i += 1







