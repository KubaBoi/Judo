#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.ErrorCodes import Error
from cheese.modules.cheeseController import CheeseController as cc

from python.repositories.EventsRepository import EventsRepository

from python.models.Events import Events

#@controller /events
class EventsController(cc):

	#@post /create
	@staticmethod
	def create(server, path, auth):
		if (auth["role"] > 1):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['NAME', 'CATEGORY', 'PLACE', 'START', 'END', 'ARRIVE', 'DEPART', 'END_VISA', 'END_ROOM', 'ORGANISER_ID', 'VISA_MAIL', 'VISA_PHONE', 'EJU_PRICE', 'PCR_PRICE', 'AG_PRICE', 'TRANS_PRICE', 'OTHER_PRICE', 'SHOW_HOTEL'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		name = args["NAME"]
		category = args["CATEGORY"]
		place = args["PLACE"]
		start = args["START"]
		end = args["END"]
		arrive = args["ARRIVE"]
		depart = args["DEPART"]
		endVisa = args["END_VISA"]
		endRoom = args["END_ROOM"]
		organiserId = args["ORGANISER_ID"]
		visaMail = args["VISA_MAIL"]
		visaPhone = args["VISA_PHONE"]
		ejuPrice = args["EJU_PRICE"]
		pcrPrice = args["PCR_PRICE"]
		agPrice = args["AG_PRICE"]
		transPrice = args["TRANS_PRICE"]
		otherPrice = args["OTHER_PRICE"]
		showHotel = args["SHOW_HOTEL"]

		newId = EventsRepository.findNewId()
		eventsModel = Events()
		eventsModel.id = newId
		eventsModel.name = name
		eventsModel.category = category
		eventsModel.place = place
		eventsModel.start = start
		eventsModel.end = end
		eventsModel.arrive = arrive
		eventsModel.depart = depart
		eventsModel.end_visa = endVisa
		eventsModel.end_room = endRoom
		eventsModel.organiser_id = organiserId
		eventsModel.visa_mail = visaMail
		eventsModel.visa_phone = visaPhone
		eventsModel.eju_price = ejuPrice
		eventsModel.pcr_price = pcrPrice
		eventsModel.ag_price = agPrice
		eventsModel.trans_price = transPrice
		eventsModel.other_price = otherPrice
		eventsModel.show_hotel = showHotel
		EventsRepository.save(eventsModel)

		response = cc.createResponse({"ID": newId}, 200)
		cc.sendResponse(server, response)

	#@post /update
	@staticmethod
	def update(server, path, auth):
		if (auth["role"] > 1):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['ID', 'NAME', 'CATEGORY', 'PLACE', 'START', 'END', 'ARRIVE', 'DEPART', 'END_VISA', 'END_ROOM', 'ORGANISER_ID', 'VISA_MAIL', 'VISA_PHONE', 'EJU_PRICE', 'PCR_PRICE', 'AG_PRICE', 'TRANS_PRICE', 'OTHER_PRICE', 'SHOW_HOTEL'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["ID"]
		name = args["NAME"]
		category = args["CATEGORY"]
		place = args["PLACE"]
		start = args["START"]
		end = args["END"]
		arrive = args["ARRIVE"]
		depart = args["DEPART"]
		endVisa = args["END_VISA"]
		endRoom = args["END_ROOM"]
		organiserId = args["ORGANISER_ID"]
		visaMail = args["VISA_MAIL"]
		visaPhone = args["VISA_PHONE"]
		ejuPrice = args["EJU_PRICE"]
		pcrPrice = args["PCR_PRICE"]
		agPrice = args["AG_PRICE"]
		transPrice = args["TRANS_PRICE"]
		otherPrice = args["OTHER_PRICE"]
		showHotel = args["SHOW_HOTEL"]

		eventsModel = EventsRepository.findById(id)
		eventsModel.id = id
		eventsModel.name = name
		eventsModel.category = category
		eventsModel.place = place
		eventsModel.start = start
		eventsModel.end = end
		eventsModel.arrive = arrive
		eventsModel.depart = depart
		eventsModel.end_visa = endVisa
		eventsModel.end_room = endRoom
		eventsModel.organiser_id = organiserId
		eventsModel.visa_mail = visaMail
		eventsModel.visa_phone = visaPhone
		eventsModel.eju_price = ejuPrice
		eventsModel.pcr_price = pcrPrice
		eventsModel.ag_price = agPrice
		eventsModel.trans_price = transPrice
		eventsModel.other_price = otherPrice
		eventsModel.show_hotel = showHotel
		EventsRepository.update(eventsModel)

		response = cc.createResponse({'STATUS': 'Event has been changed'}, 200)
		cc.sendResponse(server, response)

	#@get /getAll
	@staticmethod
	def getAll(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		eventsArray = EventsRepository.findAll()
		jsonResponse = {}
		jsonResponse["EVENTS"] = []
		for event in eventsArray:
			jsonResponse["EVENTS"].append(event.toJson())

		response = cc.createResponse(jsonResponse, 200)
		cc.sendResponse(server, response)

	#@post /getByCategory
	@staticmethod
	def getByCategory(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['CATEGORY'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		category = args["CATEGORY"]

		eventsArray = EventsRepository.findBy("columnName-category", category)
		jsonResponse = {}
		jsonResponse["EVENTS"] = []
		for event in eventsArray:
			jsonResponse["EVENTS"].append(event.toJson())

		response = cc.createResponse(jsonResponse, 200)
		cc.sendResponse(server, response)

	#@post /getByName
	@staticmethod
	def getByName(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['NAME'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		name = args["NAME"]

		eventsArray = EventsRepository.findBy("columnName-name", name)
		jsonResponse = {}
		jsonResponse["EVENTS"] = []
		for event in eventsArray:
			jsonResponse["EVENTS"].append(event.toJson())

		response = cc.createResponse(jsonResponse, 200)
		cc.sendResponse(server, response)

	#@post /getByPlace
	@staticmethod
	def getByPlace(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['PLACE'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		place = args["PLACE"]

		eventsArray = EventsRepository.findBy("columnName-place", place)
		jsonResponse = {}
		jsonResponse["EVENTS"] = []
		for event in eventsArray:
			jsonResponse["EVENTS"].append(event.toJson())

		response = cc.createResponse(jsonResponse, 200)
		cc.sendResponse(server, response)

	#@post /getByStart
	@staticmethod
	def getByStart(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['START'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		start = args["START"]

		eventsArray = EventsRepository.findBy("columnName-start", start)
		jsonResponse = {}
		jsonResponse["EVENTS"] = []
		for event in eventsArray:
			jsonResponse["EVENTS"].append(event.toJson())

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

		eventsModel = EventsRepository.findById(id)
		EventsRepository.delete(eventsModel)

		response = cc.createResponse({'STATUS': 'Event has been removed'}, 200)
		cc.sendResponse(server, response)

