#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc
from Cheese.cheeseRepository import CheeseRepository as cr

from src.repositories.registeredClubsRepository import RegisteredClubsRepository
from src.repositories.clubsRepository import ClubsRepository
from src.repositories.eventsRepository import EventsRepository
from src.repositories.registeredJbRepository import RegisteredJbRepository
from src.repositories.roomsRepository import RoomsRepository
from src.repositories.bedRepository import BedRepository
from src.repositories.registeredTestsRepository import RegisteredTestsRepository

from src.other.billCalculator import BillCalculator

#@controller /registeredClubs;
class RegisteredClubsController(cc):

	"""
	status:
	0 - not checked by organiser
	1 - not checked by club owner
	2 - registered
	"""

	#@post /create;
	@staticmethod
	def create(server, path, auth):
		args = cc.readArgs(server)

		cc.checkJson(['CLUB_ID', 'EVENT_ID', 'VISA'], args)

		clubId = args["CLUB_ID"]
		eventId = args["EVENT_ID"]
		visa = args["VISA"]

		if (RegisteredClubsRepository.isClubRegisteredInEvent(eventId, clubId)):
			raise Conflict("Club is already registered in this event")

		registeredclubsModel = RegisteredClubsRepository.model()
		registeredclubsModel.club_id = clubId
		registeredclubsModel.event_id = eventId
		registeredclubsModel.visa = visa
		registeredclubsModel.status = 0
		RegisteredClubsRepository.save(registeredclubsModel)

		return cc.createResponse({"ID": registeredclubsModel.id}, 200)


	#@post /register;
	@staticmethod
	def register(server, path, auth):
		args = cc.readArgs(server)

		cc.checkJson(['ID'], args)

		id = args["ID"]
		registeredClub = RegisteredClubsRepository.find(id)
		registeredClub.status = 1
		RegisteredClubsRepository.update(registeredClub)

		return cc.createResponse({'STATUS': 'Club has been registered'}, 200)

	#@get /get;
	@staticmethod
	def get(server, path, auth):
		args = cc.getArgs(path)

		cc.checkJson(["id"], args)
		
		id = args["id"]
		registeredClub = RegisteredClubsRepository.find(id)

		if (registeredClub == None):
			raise NotFound("Registration was not found")

		return cc.createResponse({"REGISTERED_CLUB": registeredClub.toJson()}, 200)

	#@get /getAll;
	@staticmethod
	def getAll(server, path, auth):
		regClubs = RegisteredClubsRepository.findAll()
		return cc.createResponse({"REGISTERED_CLUBS": cc.modulesToJsonArray(regClubs)}, 200)

	#@get /getByEvent;
	@staticmethod
	def getByEvent(server, path, auth):
		args = cc.getArgs(path)

		cc.checkJson(['eventId'], args)

		eventId = args["eventId"]

		registeredclubsArray = RegisteredClubsRepository.findBy("event_id", eventId)
		jsonResponse = {}
		jsonResponse["REGISTERED_CLUBS"] = []
		for registered_club in registeredclubsArray:
			jsonResponse["REGISTERED_CLUBS"].append(registered_club.toJson())

		return cc.createResponse(jsonResponse, 200)


	#@post /remove;
	@staticmethod
	def remove(server, path, auth):
		args = cc.readArgs(server)

		cc.checkJson(['ID'], args)

		id = args["ID"]

		registeredclubsModel = RegisteredClubsRepository.findById(id)
		RegisteredClubsRepository.delete(registeredclubsModel)

		return cc.createResponse({'STATUS': 'Club has been removed from registration'}, 200)

	#@get /getAllData;
	@staticmethod
	def getAllData(server, path, auth):
		regClubs = RegisteredClubsRepository.findAll()
		jsonArr = cc.modulesToJsonArray(regClubs)

		for item in jsonArr:
			club = ClubsRepository.find(item["CLUB_ID"])
			event = EventsRepository.find(item["EVENT_ID"])

			if (club == None):
				item["CLUB_NAME"] = "Not found"
			else:
				item["CLUB_NAME"] = club.name

			if (event == None):
				item["EVENT_NAME"] = "Not found"
			else:
				item["EVENT_NAME"] = event.name

		return cc.createResponse({"REGISTERED_CLUBS": jsonArr}, 200)

	#@post /calculateBill;
	@staticmethod
	def calculateBill(server, path, auth):
		args = cc.readArgs(server)

		cc.checkJson(["JBS", "ARRIVALS", "DEPARTS", "EVENT_ID"], args)

		if (len(args["JBS"]) == 0):
			raise BadRequest("There not any people")

		event = EventsRepository.find(args["EVENT_ID"])
		club = ClubsRepository.find(args["JBS"][0]["CLUB_ID"])

		billAccData, billPackData, billSumData = BillCalculator.getCalculatedBillData(
			args["JBS"], 
			event,
			club,
			args["ARRIVALS"],
			args["DEPARTS"]
		)

		return cc.createResponse(
			{
				"BILL_ACC_DATA": billAccData,
				"BILL_PACK_DATA": billPackData,
				"BILL_SUM_DATA": billSumData
			}, 200)

	#@post /confirmReg;
	@staticmethod
	def confirmReg(server, path, auth):
		args = cc.readArgs(server)

		cc.checkJson(["JBS", "ARRIVALS", "DEPARTS", "EVENT_ID"], args)

		if (len(args["JBS"]) == 0):
			raise BadRequest("There not any people")

		jbs = []
		for jb in args["JBS"]:
			if (not jb["ISIN"]): continue
			jbs.append(jb)

		event = EventsRepository.find(args["EVENT_ID"])
		reg_club = RegisteredClubsRepository.registeredClubInEvent(event.id, args["JBS"][0]["CLUB_ID"])
		club = ClubsRepository.find(args["JBS"][0]["CLUB_ID"])

		billAccData, billPackData, billSumData = BillCalculator.getCalculatedBillData(
			args["JBS"], 
			event,
			club,
			args["ARRIVALS"],
			args["DEPARTS"]
		)

		cr.disableAutocommit()
		try:
			addJbsId = RegisteredJbRepository.findNewId()
			addTestsId = RegisteredTestsRepository.findNewId()
			regBeds = []
			for jb in jbs:
				arrival = args["ARRIVALS"][jb["ARR_FLIGHT"]]
				depart = args["DEPARTS"][jb["DEP_FLIGHT"]]
				jbModel = RegisteredClubsController.registerJb(jb, reg_club, arrival, depart, addJbsId)
				addJbsId += 1

				roomId = jb["ROOM_ID"]
				regBeds = RegisteredClubsController.registerBed(roomId, jbModel, regBeds)

				addTestsId = RegisteredClubsController.registerTests(jb["PCR_TESTS"], jbModel.id, True, addTestsId)
				addTestsId = RegisteredClubsController.registerTests(jb["AG_TESTS"], jbModel.id, False, addTestsId)

			reg_club.status = 2
			RegisteredClubsRepository.update(reg_club)
			cr.commit()
		except Exception as e:
			cr.disableAutocommit()
			raise e

		return cc.createResponse({"STATUS": "Club has been registered"}, 200)

	# METHODS

	@staticmethod
	def registerJb(jb, reg_club, arrival, depart, i):
		jbModel = RegisteredJbRepository.model(i)
		jbModel.setAttrs(
			reg_club_id=reg_club.id,
			jb_id=jb["ID"],
			arrive=arrival["TIME"],
			departure=depart["TIME"],
			transport=arrival["NEED_TRANS"],
			flight_number=arrival["NUMBER"]
		)
		RegisteredJbRepository.save(jbModel)
		return jbModel

	@staticmethod
	def registerBed(roomId, jbModel, regBeds):
		freeBeds = BedRepository.findByRoomId(roomId)
		freeBed = None
		for fBed in freeBeds:
			if (fBed.id not in regBeds): 
				freeBed = fBed
				break

		if (freeBed == None):
			raise Conflict("Room is no longer available")

		regBeds.append(freeBed.id)
		freeBed.reg_jb_id = jbModel.id
		BedRepository.update(freeBed)

		roomModel = RoomsRepository.find(roomId)
		roomModel.available = False
		RoomsRepository.update(roomModel)
		return regBeds

	@staticmethod
	def registerTests(count, jbModelId, pcr, addId):
		for i in range(count):
			addId += 1
			testModel = RegisteredTestsRepository.model(addId)
			testModel.setAttrs(
				reg_jb_id=jbModelId,
				pcr=pcr,
				date=None
			)
			RegisteredTestsRepository.save(testModel)
		return addId+1



