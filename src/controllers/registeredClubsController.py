#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc

from src.repositories.registeredClubsRepository import RegisteredClubsRepository
from src.repositories.clubsRepository import ClubsRepository
from src.repositories.eventsRepository import EventsRepository

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

		if (not cc.validateJson(['CLUB_ID', 'EVENT_ID', 'VISA'], args)):
			raise BadRequest("Wrong json structure")

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

		if (not cc.validateJson(['ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["ID"]
		registeredClub = RegisteredClubsRepository.find(id)
		registeredClub.status = 1
		RegisteredClubsRepository.update(registeredClub)

		return cc.createResponse({'STATUS': 'Club has been registered'}, 200)

	#@get /getAll;
	@staticmethod
	def getAll(server, path, auth):
		regClubs = RegisteredClubsRepository.findAll()
		return cc.createResponse({"REGISTERED_CLUBS": cc.modulesToJsonArray(regClubs)}, 200)

	#@get /getByEvent;
	@staticmethod
	def getByEvent(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['eventId'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

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

		if (not cc.validateJson(['ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

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
			item["CLUB_NAME"] = ClubsRepository.find(item["CLUB_ID"]).name
			item["EVENT_NAME"] = EventsRepository.find(item["EVENT_ID"]).name


		return cc.createResponse({"REGISTERED_CLUBS": jsonArr}, 200)


