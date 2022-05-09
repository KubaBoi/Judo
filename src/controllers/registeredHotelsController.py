#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.ErrorCodes import Error
from Cheese.cheeseController import CheeseController as cc

from src.repositories.registeredHotelsRepository import RegisteredHotelsRepository

#@controller /registeredHotels;
class RegisteredHotelsController(cc):

	#@post /create;
	@staticmethod
	def create(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['HOTEL_ID', 'EVENT_ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		hotelId = args["HOTEL_ID"]
		eventId = args["EVENT_ID"]

		registeredhotelsModel = RegisteredHotelsRepository.model()
		registeredhotelsModel.hotel_id = hotelId
		registeredhotelsModel.event_id = eventId
		RegisteredHotelsRepository.save(registeredhotelsModel)

		return cc.createResponse({"ID": registeredhotelsModel.id}, 200)


	#@post /getByEvent;
	@staticmethod
	def getByEvent(server, path, auth):
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

		return cc.createResponse(jsonResponse, 200)


	#@post /remove;
	@staticmethod
	def remove(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["ID"]

		registeredhotelsModel = RegisteredHotelsRepository.findById(id)
		RegisteredHotelsRepository.delete(registeredhotelsModel)

		return cc.createResponse({'STATUS': 'Hotel has been removed from registration'}, 200)


