
from datetime import timedelta

from src.repositories.registeredClubsRepository import RegisteredClubsRepository as rcr
from src.repositories.roomsRepository import RoomsRepository as rr
from src.repositories.eventsRepository import EventsRepository
from src.repositories.clubsRepository import ClubsRepository

class BillCalculator:

    roomNames = {
        1: "Single",
        2: "Double",
        3: "Triple",
        4: "Apartman"
    }

    packageNames = {
        "RO": "Room Only",
        "BB": "Bed and Breakfast",
        "HB": "Half Board",
        "FB": "Full Board",
        "LIV": "Lunch In Venue"
    }

    @staticmethod
    def getCalculatedBillData(args):

        event = EventsRepository.find(args["EVENT_ID"])
        club = ClubsRepository.find(args["CLUB_ID"])

        jbsAll = args["JBS"]
        arrivals = args["ARRIVALS"]
        departs = args["DEPARTS"]

        jbs = []
        for jb in jbsAll:
            if (not jb["ISIN"]): continue
            jbs.append(jb)

        days = BillCalculator.prepareDays(event)

        # int(args["EVENT_ID"]), int(args["CLUB_ID"])

        billAccData = BillCalculator.getBillAccData(jbs, days)
        billPackData = BillCalculator.getBillPackData(jbs, days)

        billSumData = BillCalculator.getBillSumData(jbs, event, club, arrivals, departs, billAccData, billPackData)

        return (billAccData, billPackData, billSumData)

    @staticmethod
    def getBillSumData(jbs, event, club, arrivals, departs, billAccData, billPackData):
        billSumData = {}
        billSumData["ITEMS"] = []

        billSumData["ITEMS"].append({
            "name": "Accommodation",
            "number": 1,
            "price": billAccData["total"],
            "total": billAccData["total"]
        })

        billSumData["ITEMS"].append({
            "name": "Packages",
            "number": 1,
            "price": billPackData["total"],
            "total": billPackData["total"]
        })

        competitorsCount = sum([1 for x in jbs if x["FUNCTION"] == "Competitor"])
        ejuCount = 0 if club.eju else competitorsCount
        
        billSumData["ITEMS"].append({
            "name": "EJU",
            "number": ejuCount,
            "price": event.eju_price,
            "total": event.eju_price * ejuCount
        })

        pcrCount = sum([x["PCR_TESTS"] for x in jbs if x["ISIN"]])
        billSumData["ITEMS"].append({
            "name": "PCR Tests",
            "number": pcrCount,
            "price": event.pcr_price,
            "total": event.pcr_price * pcrCount
        })

        agCount = sum([x["AG_TESTS"] for x in jbs if x["ISIN"]])
        billSumData["ITEMS"].append({
            "name": "AG Tests",
            "number": agCount,
            "price": event.ag_price,
            "total": event.ag_price * agCount
        })

        transCount = sum([1 for x in jbs if arrivals[int(x["ARR_FLIGHT"])]["NEED_TRANS"]])
        transCount += sum([1 for x in jbs if departs[int(x["DEP_FLIGHT"])]["NEED_TRANS"]])

        billSumData["ITEMS"].append({
            "name": "Transport",
            "number": transCount,
            "price": event.trans_price,
            "total": event.trans_price * transCount
        })

        billSumData["ITEMS"].append({
            "name": "Other",
            "number": 1,
            "price": event.other_price,
            "total": event.other_price
        })

        billSumData["total"] = sum([x["total"] for x in billSumData["ITEMS"]])

        return billSumData

    @staticmethod
    def getBillPackData(jbs, days):

        packages = {}

        for jb in jbs:

            packageKey = BillCalculator.getPackageKey(jb)
            if (packageKey not in packages.keys()):
                packages[packageKey] = {}
                packages[packageKey]["JBS"] = []
                packages[packageKey]["ROOM_ARRAY"] = []

            packages[packageKey]["JBS"].append(jb)
            if (jb["ROOM_ID"] not in packages[packageKey]["ROOM_ARRAY"]):
                packages[packageKey]["ROOM_ARRAY"].append(jb["ROOM_ID"])

        billPackData = {}
        billPackData["PACKAGES"] = []

        for packageKey in packages.keys():
            package = packages[packageKey]

            beds, packageShort, price, daysArr = BillCalculator.decodePackageKey(
                packageKey)

            startDate = days[int(daysArr[0].strip())]
            endDate = days[int(daysArr[-1].strip())]

            billPackData["PACKAGES"].append(
                {
                    "room_name": BillCalculator.roomNames[beds],
                    "package_name": BillCalculator.packageNames[packageShort],
                    "price": price,
                    "start_date": startDate,
                    "end_date": endDate,
                    "nights": len(daysArr)-1,
                    "count_people": len(package["JBS"]),
                    "count_room": len(package["ROOM_ARRAY"]),
                    "total": len(package["JBS"]) * (len(daysArr)-1) * price
                }
            )

        total = 0
        for room in billPackData["PACKAGES"]:
            total += room["total"]
        billPackData["total"] = total
        return billPackData

    @staticmethod
    def getBillAccData(jbs, days):
        rooms = {}

        for jb in jbs:

            roomKey = BillCalculator.getRoomKey(jb)
            if (roomKey not in rooms.keys()):
                rooms[roomKey] = {}
                rooms[roomKey]["JBS"] = []
                rooms[roomKey]["ROOM_ARRAY"] = []

            rooms[roomKey]["JBS"].append(jb)
            if (jb["ROOM_ID"] not in rooms[roomKey]["ROOM_ARRAY"]):
                rooms[roomKey]["ROOM_ARRAY"].append(jb["ROOM_ID"])

        billAccData = {}
        billAccData["ROOMS"] = []

        for roomKey in rooms.keys():
            room = rooms[roomKey]

            beds, price, daysArr = BillCalculator.decodeRoomKey(roomKey)

            startDate = days[int(daysArr[0].strip())]
            endDate = days[int(daysArr[-1].strip())]

            billAccData["ROOMS"].append(
                {
                    "room_name": BillCalculator.roomNames[beds],
                    "price_ro": price,
                    "start_date": startDate,
                    "end_date": endDate,
                    "nights": len(daysArr)-1,
                    "count_people": len(room["JBS"]),
                    "count_room": len(room["ROOM_ARRAY"]), # tady nevim jestli tam dole ma byt tohle nebo len(room["JBS"])
                    "total": len(room["ROOM_ARRAY"]) * (len(daysArr)-1) * price
                }
            )

        total = 0
        for room in billAccData["ROOMS"]:
            total += room["total"]
        billAccData["total"] = total
        return billAccData

    @staticmethod
    def getPackageKey(jb):
        room = rr.find(jb["ROOM_ID"])
        return f"{room.bed}-{jb['PACKAGE']}-{getattr(room, jb['PACKAGE'].lower())}-{jb['ROOMING_LIST']}"

    @staticmethod
    def decodePackageKey(packageKey):
        beds = int(packageKey.split("-")[0])
        package = packageKey.split("-")[1]
        price = int(packageKey.split("-")[2])
        daysArr = packageKey.split(
            "-")[3].replace("[", "").replace("]", "").split(",")

        return (beds, package, price, daysArr)

    @staticmethod
    def getRoomKey(jb):
        room = rr.find(jb["ROOM_ID"])
        return f"{room.bed}-{room.price}-{jb['ROOMING_LIST']}"

    @staticmethod
    def decodeRoomKey(roomKey):
        beds = int(roomKey.split("-")[0])
        price = int(roomKey.split("-")[1])
        daysArr = roomKey.split("-")[2].replace("[", "").replace("]", "").split(",")

        return (beds, price, daysArr)

    @staticmethod
    def daterange(date1, date2):
        for n in range(int((date2 - date1).days)+1):
            yield date1 + timedelta(n)

    @staticmethod
    def prepareDays(event):
        days = []
        for dt in BillCalculator.daterange(event.event_start, event.event_end):
            days.append(dt)
        return days
