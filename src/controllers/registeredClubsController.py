#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc

from src.repositories.registeredClubsRepository import RegisteredClubsRepository
from src.repositories.clubsRepository import ClubsRepository
from src.repositories.eventsRepository import EventsRepository
from src.repositories.registeredJbRepository import RegisteredJbRepository
from src.repositories.roomsRepository import RoomsRepository

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

		print(jbs)

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

		return cc.createResponse({"STATUS": "Club has been registered"}, 200)

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


