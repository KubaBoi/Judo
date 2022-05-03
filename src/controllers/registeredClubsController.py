#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.ErrorCodes import Error
from Cheese.cheeseController import CheeseController as cc

from src.repositories.registeredClubsRepository import RegisteredClubsRepository

#@controller /registeredClubs;
class RegisteredClubsController(cc):

	#@post /create;
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

		registeredclubsModel = RegisteredClubsRepository.model()
		registeredclubsModel.club_id = clubId
		registeredclubsModel.event_id = eventId
		registeredclubsModel.visa = visa
		RegisteredClubsRepository.save(registeredclubsModel)

		return cc.createResponse({"ID": registeredclubsModel.id}, 200)


	#@post /register;
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

		return cc.createResponse({'STATUS': 'Club has been registered'}, 200)


	#@post /getByEvent;
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

		return cc.createResponse(jsonResponse, 200)


	#@post /remove;
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

		return cc.createResponse({'STATUS': 'Club has been removed from registration'}, 200)


