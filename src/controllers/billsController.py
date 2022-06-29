
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

from src.other.billCalculator import BillCalculator
from src.other.billCreator import BillCreator

#@controller /bills;
class BillsController(cc):

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
    
    # METHODS

    @staticmethod
    def prepareDataFromDb(args):
        event = EventsRepository.find(args["eventId"])
        regClub = RegisteredClubsRepository.find(args["regClubId"])
        club = ClubsRepository.find(regClub.club_id)

        billModel = BillsRepository.findByEventAndRegClub(args["eventId"], args["regClubId"])
        billItems = BillItemsRepository.findBy("bill_id", billModel.id)
        
        acc = None
        pack = None
        for item in billItems:
            if (item.name == "Accommodation"): acc = item
            if (item.name == "Packages"): pack = item

        billRooms = BillRoomsRepository.findBy("bill_item_id", acc.id)
        billPackages = BillPackagesRepository.findBy("bill_item_id", pack.id)

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







