import platform
import pdfkit
import os

from Cheese.resourceManager import ResMan
from Cheese.appSettings import Settings

from src.repositories.eventsRepository import EventsRepository
from src.repositories.registeredClubsRepository import RegisteredClubsRepository
from src.repositories.clubsRepository import ClubsRepository
from src.repositories.usersRepository import UsersRepository
from src.repositories.jbRepository import JbRepository
from src.repositories.registeredJbRepository import RegisteredJbRepository
from src.repositories.roomDatasRepository import RoomDatasRepository
from src.repositories.registeredTestsRepository import RegisteredTestsRepository

from src.other.billCalculator import BillCalculator

class PdfCreator:

    @staticmethod
    def createPdf(eventId):
        event = EventsRepository.find(eventId)
        regClubs = RegisteredClubsRepository.findWhere(event_id=eventId)

        clubsHtml = PdfCreator.prepareTables(regClubs)

        with open(ResMan.resources("pdfEventTemp.html"), "r") as f:
            data = f.read()

        data = data.replace("$PORT$", str(Settings.port))
        data = data.replace("$EVENT$", event.name)
        data = data.replace("$CLUBS$", clubsHtml)
        fileName = f"event-{event.name}-{event.event_start}.pdf"
        tempFile = ResMan.resources(f"event-{event.name}-{event.event_start}.html")
        with open(tempFile, "w", encoding="utf-8") as f:
            f.write(data)

        if (platform.system() == "Windows"):
            config = pdfkit.configuration(wkhtmltopdf = r"C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe") 
            pdfkit.from_file(tempFile, ResMan.web("bills", "pdf", fileName), configuration=config)
        else:
            pdfkit.from_file(tempFile, ResMan.web("bills", "pdf", fileName))

        os.remove(tempFile)
        return fileName
        
    @staticmethod
    def createShortPdf(eventId):
        event = EventsRepository.find(eventId)
        regClubs = RegisteredClubsRepository.findWhere(event_id=eventId)

        with open(ResMan.resources("pdfEventTemp.html"), "r") as f:
            data = f.read()

        data = data.replace("$PORT$", str(Settings.port))
        data = data.replace("$EVENT$", event.name)
        data = data.replace("$CLUBS$", PdfCreator.prepareShortClubs(event, regClubs))

        fileName = f"event-{event.name}-{event.event_start}-short.pdf"
        tempFile = ResMan.resources(f"event-{event.name}-{event.event_start}-short.html")
        with open(tempFile, "w", encoding="utf-8") as f:
            f.write(data)

        if (platform.system() == "Windows"):
            config = pdfkit.configuration(wkhtmltopdf = r"C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe") 
            pdfkit.from_file(tempFile, ResMan.web("bills", "pdf", fileName), configuration=config)
        else:
            pdfkit.from_file(tempFile, ResMan.web("bills", "pdf", fileName))

        os.remove(tempFile)
        return fileName


    @staticmethod
    def prepareShortClubs(event, regClubs):
        data = """
        <table>
            <tr>
                <th rowspan=2>Name</th>
                <th colspan=2>Tests</th>
                <th colspan=4>Meals</th>
                <th rowspan=2>Transports</th>
                <th rowspan=2>EJU fee</th>
                <th rowspan=2>Clovekonoci</th>
            </tr>
            <tr>
                <th>PCR</th>
                <th>AC</th>
                <th>BB</th>
                <th>HB</th>
                <th>FB</th>
                <th>LIV</th>
            </tr>
        """

        for regClub in regClubs:
            club = ClubsRepository.find(regClub.club_id)

            data += "<tr>"
            data += f"<td>{club.name}</td>"

            if (regClub.status == 0):
                data += "<td colspan=9 class='notChecked'>Waiting for organiser</td>"
                continue
            elif (regClub.status == 1):
                data += "<td colspan=9 class='notCheckedOwner'>Waiting for client</td>"
                continue

            jbs = RegisteredJbRepository.findWhere(reg_club_id=regClub.id)

            totalPcrs = 0
            totalAgs = 0
            totalBB = 0
            totalHB = 0
            totalFB = 0
            totalLIV = 0
            totalTransport = 0
            totalEjuFee = 0
            totalClovekonoci = 0

            for regJb in jbs:
                tests = RegisteredTestsRepository.findWhere(reg_jb_id=regJb.id)
                pcrs = 0
                ags = 0
                for test in tests:
                    if (test.pcr): pcrs += 1
                    else: ags += 1

                totalPcrs += pcrs
                totalAgs += ags

                jb = JbRepository.find(regJb.jb_id)
                roomData = RoomDatasRepository.find(regJb.id)

                totalBB += 1 if (roomData.package_name == BillCalculator.packageNames["BB"]) else 0
                totalHB += 1 if (roomData.package_name == BillCalculator.packageNames["HB"]) else 0
                totalFB += 1 if (roomData.package_name == BillCalculator.packageNames["FB"]) else 0
                totalLIV += 1 if (roomData.package_name == BillCalculator.packageNames["LIV"]) else 0

                totalTransport += 1 if (regJb.transport) else 0

                totalEjuFee += event.eju_price if (not club.eju and jb.function == "Competitor") else 0

                for i in BillCalculator.daterange(regJb.arrive, regJb.departure):
                    totalClovekonoci += 1
                totalClovekonoci -= 1
                    
            data += f"<td>{totalPcrs}</td>"
            data += f"<td>{totalAgs}</td>"
            data += f"<td>{totalBB}</td>"
            data += f"<td>{totalHB}</td>"
            data += f"<td>{totalFB}</td>"
            data += f"<td>{totalLIV}</td>"
            data += f"<td>{totalTransport}</td>"
            data += f"<td>{totalEjuFee} €</td>"
            data += f"<td>{totalClovekonoci}</td></tr>"

        return data + "</table>"

    @staticmethod
    def prepareTables(regClubs):
        clubsHtml = ""
        for regClub in regClubs:
            with open(ResMan.resources("pdfClubTableTemp.html"), "r") as f:
                data = f.read()

            clubModel = ClubsRepository.find(regClub.club_id)
            userModel = UsersRepository.find(clubModel.user_id)

            data = data.replace("$NAME$", clubModel.name)
            data = data.replace("$STATUS$", PdfCreator.getStatus(regClub.status))
            data = data.replace("$ADDRESS$", clubModel.address)
            data = data.replace("$OWNER$", userModel.full_name)
            data = data.replace("$PHONE$", userModel.phone)
            data = data.replace("$EMAIL$", userModel.login)

            regJbs = RegisteredJbRepository.findWhere(reg_club_id=regClub.id)
            if (len(regJbs) == 0):
                data = data.replace("$ARRIVALS$", "<tr><td class='center' colspan='5'>No arrivals</td></tr>")
                data = data.replace("$DEPARTURES$", "<tr><td class='center' colspan='5'>No departures</td></tr>")
                data = data.replace("$PEOPLE$", "<tr><td class='center' colspan='8'>No people</td></tr>")
                data = data.replace("$SUM_PCR$", "0")
                data = data.replace("$SUM_AG$", "0")
                clubsHtml += data + "<br><hr><br>"
                continue

            totalPcrs = 0
            totalAgs = 0
            for regJb in regJbs:
                tests = RegisteredTestsRepository.findWhere(reg_jb_id=regJb.id)
                pcrs = 0
                ags = 0
                for test in tests:
                    if (test.pcr): pcrs += 1
                    else: ags += 1

                totalPcrs += pcrs
                totalAgs += ags

                setattr(regJb, "jb", JbRepository.find(regJb.jb_id))
                setattr(regJb, "room_data", RoomDatasRepository.find(regJb.id))
                setattr(regJb, "pcr_tests", pcrs)
                setattr(regJb, "ag_tests", ags)

            data = data.replace("$ARRIVALS$", PdfCreator.prepareFlights(regJbs, "flight_number", "arrive"))
            data = data.replace("$DEPARTURES$", PdfCreator.prepareFlights(regJbs, "dep_number", "departure"))
            data = data.replace("$PEOPLE$", PdfCreator.preparePeople(regJbs))
            data = data.replace("$SUM_PCR$", str(totalPcrs))
            data = data.replace("$SUM_AG$", str(totalAgs))
            clubsHtml += data + "<br><hr><br>"
        return clubsHtml

    @staticmethod
    def getStatus(status):
        if (status == 0): return "<span class='notChecked'>Not checked by organiser</span>"
        if (status == 1): return "<span class='notCheckedOwner'>Not checked by club owner</span>"
        if (status == 2): return "<span class='registered'>REGISTERED</span>"

    @staticmethod
    def prepareFlights(regJbs, attrName, timeName):
        arr = []
        for jb in regJbs:
            skip = False
            for it in arr:
                if (getattr(jb, attrName) == it["number"]):
                    it["jbs"].append(jb)
                    skip = True
                    break
            if (skip): continue
            arr.append({
                "number": getattr(jb, attrName) ,
                "time": getattr(jb, timeName),
                "transport": jb.transport,
                "jbs": [jb]
            })

        data = ""
        for it in arr:
            data += f"""
            <tr>
                <td>{it["time"]}</td>
                <td>{it["number"]}</td>
                <td>{it["transport"]}</td>
                <td>{len(it["jbs"])}</td>
            </tr>
            """
        return data
            
    @staticmethod
    def preparePeople(regJbs):
        data = ""
        for jb in regJbs:
            data += f"""
            <tr>
                <td>{jb.jb.sur_name} {jb.jb.name}</td>
                <td>{jb.jb.function}</td>
                <td>{jb.arrive}</td>
                <td>{jb.departure}</td>
                <td>{jb.room_data.room_name}</td>
                <td>{jb.room_data.package_name}</td>
                <td>{jb.pcr_tests}</td>
                <td>{jb.ag_tests}</td>
            </tr>
            """
        return data