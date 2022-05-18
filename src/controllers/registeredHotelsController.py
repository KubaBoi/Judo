#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc

from src.repositories.registeredHotelsRepository import RegisteredHotelsRepository

#@controller /registeredHotels;
class RegisteredHotelsController(cc):

	#@post /create;
	@staticmethod
	def create(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['HOTEL_ID', 'EVENT_ID'], args)):
			raise BadRequest("Wrong json structure")

		hotelId = args["HOTEL_ID"]
		eventId = args["EVENT_ID"]

		registeredhotelsModel = RegisteredHotelsRepository.model()
		registeredhotelsModel.hotel_id = hotelId
		registeredhotelsModel.event_id = eventId
		RegisteredHotelsRepository.save(registeredhotelsModel)

		return cc.createResponse({"ID": registeredhotelsModel.id}, 200)


	#@get /getByEvent;
	@staticmethod
	def getByEvent(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['eventId'], args)):
			raise BadRequest("Wrong json structure")

		eventId = args["eventId"]

		registeredhotelsArray = RegisteredHotelsRepository.findBy("event_id", eventId)
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
			raise BadRequest("Wrong json structure")

		id = args["ID"]

		registeredhotelsModel = RegisteredHotelsRepository.findById(id)
		RegisteredHotelsRepository.delete(registeredhotelsModel)

		return cc.createResponse({'STATUS': 'Hotel has been removed from registration'}, 200)


