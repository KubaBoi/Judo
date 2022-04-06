#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.ErrorCodes import Error
from cheese.modules.cheeseController import CheeseController as cc

from python.repositories.RegisteredClubsRepository import RegisteredClubsRepository

from python.models.RegisteredClubs import RegisteredClubs

#@controller /registeredClubs
class RegisteredClubsController(cc):

	#@post /create
	@staticmethod
	def create(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['CLUB_ID', 'EVENT_ID', 'VISA'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		clubId = args["CLUB_ID"]
		eventId = args["EVENT_ID"]
		visa = args["VISA"]

		newId = RegisteredClubsRepository.findNewId()
		registeredclubsModel = RegisteredClubs()
		registeredclubsModel.id = newId
		registeredclubsModel.club_id = clubId
		registeredclubsModel.event_id = eventId
		registeredclubsModel.visa = visa
		RegisteredClubsRepository.save(registeredclubsModel)

		response = cc.createResponse({"ID": newId}, 200)
		cc.sendResponse(server, response)

	#@post /register
	@staticmethod
	def register(server, path, auth):
		if (auth["role"] > 1):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["ID"]

		response = cc.createResponse({'STATUS': 'Club has been registered'}, 200)
		cc.sendResponse(server, response)

	#@post /getByEvent
	@staticmethod
	def getByEvent(server, path, auth):
		if (auth["role"] > 1):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['EVENT_ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		eventId = args["EVENT_ID"]

		registeredclubsArray = RegisteredClubsRepository.findBy("columnName-event_id", eventId)
		jsonResponse = {}
		jsonResponse["REGISTERED_CLUBS"] = []
		for registered_club in registeredclubsArray:
			jsonResponse["REGISTERED_CLUBS"].append(registered_club.toJson())

		response = cc.createResponse(jsonResponse, 200)
		cc.sendResponse(server, response)

	#@post /remove
	@staticmethod
	def remove(server, path, auth):
		if (auth["role"] > 1):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["ID"]

		registeredclubsModel = RegisteredClubsRepository.findById(id)
		RegisteredClubsRepository.delete(registeredclubsModel)

		response = cc.createResponse({'STATUS': 'Club has been removed from registration'}, 200)
		cc.sendResponse(server, response)

