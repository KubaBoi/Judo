#!/usr/bin/env python
# -*- coding: utf-8 -*-

from datetime import timedelta, date, datetime

from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc

from src.repositories.registeredClubsRepository import RegisteredClubsRepository
from src.repositories.clubsRepository import ClubsRepository
from src.repositories.eventsRepository import EventsRepository
from src.repositories.registeredJbRepository import RegisteredJbRepository
from src.repositories.roomsRepository import RoomsRepository

#@controller /registeredClubs;
class RegisteredClubsController(cc):

	"""
	status:
	0 - not checked by organiser
	1 - not checked by club owner
	2 - registered
	"""

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

	#@post /confirmReg;
	@staticmethod
	def confirmReg(server, path, auth):
		args = cc.readArgs(server)

		cc.checkJson(["JBS", "ARRIVALS", "DEPARTS", "EVENT_ID"], args)


		return cc.createResponse({"STATUS": "Club has been registered"}, 200)

	#@post /calculateBill;
	@staticmethod
	def calculateBill(server, path, auth):
		args = cc.readArgs(server)

		cc.checkJson(["JBS", "EVENT_ID"], args)

		if (len(args["JBS"]) == 0):
			raise BadRequest("There not any people")

		jbs = []
		for jb in args["JBS"]:
			if (not jb["ISIN"]): continue
			jbs.append(jb)

		event = EventsRepository.find(args["EVENT_ID"])
		days = RegisteredClubsController.prepareDays(event)

		#int(args["EVENT_ID"]), int(args["JBS"][0]["CLUB_ID"])

		billAccData = RegisteredClubsController.getBillAccData(jbs, days)
		billPackData = RegisteredClubsController.getBillPackData(jbs, days)

		print({
			"BILL_ACC_DATA": billAccData,
			"BILL_PACK_DATA": billPackData
		})

		return cc.createResponse(
			{
				"BILL_ACC_DATA": billAccData,
				"BILL_PACK_DATA": billPackData
			}, 200)

	# METHODS

	@staticmethod
	def getBillPackData(jbs, days):

		packages = {}

		for jb in jbs:

			packageKey = RegisteredClubsController.getPackageKey(jb)
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

			beds, packageShort, price, daysArr = RegisteredClubsController.decodePackageKey(packageKey)

			startDate = days[int(daysArr[0].strip())]
			endDate = days[int(daysArr[-1].strip())]

			billPackData["PACKAGES"].append(
				{
					"room_name": RegisteredClubsController.roomNames[beds],
					"package_name": RegisteredClubsController.packageNames[packageShort],
					"price_ro": price,
					"start_date": startDate.strftime("%d.%m"),
					"end_date": endDate.strftime("%d.%m"),
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

			roomKey = RegisteredClubsController.getRoomKey(jb)
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

			beds, price, daysArr = RegisteredClubsController.decodeRoomKey(roomKey)

			startDate = days[int(daysArr[0].strip())]
			endDate = days[int(daysArr[-1].strip())]

			billAccData["ROOMS"].append(
				{
					"room_name": RegisteredClubsController.roomNames[beds],
					"price_ro": price,
					"start_date": startDate.strftime("%d.%m"),
					"end_date": endDate.strftime("%d.%m"),
					"nights": len(daysArr)-1,
					"count_people": len(room["JBS"]),
					"count_room": len(room["ROOM_ARRAY"]),
					"total": len(room["JBS"]) * (len(daysArr)-1) * price 
				}
			)

		total = 0
		for room in billAccData["ROOMS"]:
			total += room["total"]
		billAccData["total"] = total
		return billAccData

	@staticmethod
	def getPackageKey(jb):
		room = RoomsRepository.find(jb["ROOM_ID"])
		return f"{room.bed}-{jb['PACKAGE']}-{getattr(room, jb['PACKAGE'].lower())}-{jb['ROOMING_LIST']}"

	@staticmethod
	def decodePackageKey(packageKey):
		beds = int(packageKey.split("-")[0])
		package = packageKey.split("-")[1]
		price = int(packageKey.split("-")[2])
		daysArr = packageKey.split("-")[3].replace("[", "").replace("]", "").split(",")

		return (beds, package, price, daysArr)

	@staticmethod
	def getRoomKey(jb):
		room = RoomsRepository.find(jb["ROOM_ID"])
		return f"{room.bed}-{room.price}-{jb['ROOMING_LIST']}"

	@staticmethod
	def decodeRoomKey(roomKey):
		beds = int(roomKey.split("-")[0])
		price = int(roomKey.split("-")[1])
		daysArr = roomKey.split("-")[2].replace("[", "").replace("]", "").split(",")
		
		return (beds, price, daysArr)

	@staticmethod
	def daterange(date1, date2):
		for n in range(int ((date2 - date1).days)+1):
			yield date1 + timedelta(n)

	@staticmethod
	def prepareDays(event):
		days = []
		for dt in RegisteredClubsController.daterange(event.event_start, event.event_end):
			days.append(dt)
		return days


