#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.ErrorCodes import Error
from cheese.modules.cheeseController import CheeseController as cc

from python.repositories.registeredHotelsRepository import RegisteredHotelsRepository

from python.models.registeredHotels import RegisteredHotels

#@controller /registeredHotels
class RegisteredHotelsController(cc):

	#@post /create
	@staticmethod
	def create(server, path, auth):
		if (auth["role"] > 1):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['HOTEL_ID', 'EVENT_ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		hotelId = args["HOTEL_ID"]
		eventId = args["EVENT_ID"]

		newId = RegisteredHotelsRepository.findNewId()
		registeredhotelsModel = RegisteredHotels()
		registeredhotelsModel.id = newId
		registeredhotelsModel.hotel_id = hotelId
		registeredhotelsModel.event_id = eventId
		RegisteredHotelsRepository.save(registeredhotelsModel)

		response = cc.createResponse({"ID": newId}, 200)
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

		registeredhotelsArray = RegisteredHotelsRepository.findBy("columnName-event_id", eventId)
		jsonResponse = {}
		jsonResponse["REGISTERED_HOTELS"] = []
		for registered_hotel in registeredhotelsArray:
			jsonResponse["REGISTERED_HOTELS"].append(registered_hotel.toJson())

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

		registeredhotelsModel = RegisteredHotelsRepository.findById(id)
		RegisteredHotelsRepository.delete(registeredhotelsModel)

		response = cc.createResponse({'STATUS': 'Hotel has been removed from registration'}, 200)
		cc.sendResponse(server, response)

