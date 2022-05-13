#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.ErrorCodes import Error
from Cheese.cheeseController import CheeseController as cc

from src.repositories.eventsRepository import EventsRepository

#@controller /events;
class EventsController(cc):

	#@post /create;
	@staticmethod
	def create(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['HARD_CREATE', 'NAME', 'CATEGORY', 'PLACE', 'START', 'END', 'ARRIVE', 'DEPART', 'END_VISA', 'END_ROOM', 'ORGANISER_ID', 'VISA_MAIL', 'VISA_PHONE', 'EJU_PRICE', 'PCR_PRICE', 'AG_PRICE', 'TRANS_PRICE', 'OTHER_PRICE', 'SHOW_HOTEL'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		hardCreate = args["HARD_CREATE"]
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

		exists = EventsRepository.findBy("name", name)
		if (exists == None):
			return
		if (len(exists) > 0 and not hardCreate):
			Error.sendCustomError(server, "Event already exists", 409)
			return

		eventsModel = EventsRepository.model()
		eventsModel.name = name
		eventsModel.category = category
		eventsModel.place = place
		eventsModel.event_start = start
		eventsModel.event_end = end
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

		return cc.createResponse({"ID": eventsModel.id}, 200)

	#@post /update;
	@staticmethod
	def update(server, path, auth):
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

		eventsModel = EventsRepository.find(id)
		eventsModel.name = name
		eventsModel.category = category
		eventsModel.place = place
		eventsModel.event_start = start
		eventsModel.event_end = end
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

		return cc.createResponse({'STATUS': 'Event has been changed'}, 200)

	#@get /getEvent;
	@staticmethod
	def getEvent(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['id'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["id"]

		event = EventsRepository.find(id)
		if (event == None):
			Error.sendCustomError(server, "Event was not found", 404)
			return

		jsonResponse = {}
		jsonResponse["EVENT"] = event.toJson()

		return cc.createResponse(jsonResponse, 200)

	#@get /getBy;
	@staticmethod
	def getBy(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(["column"], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		column = args["column"]

		eventsArray = EventsRepository.findBySorted("columnName-" + column)
		jsonResponse = {}
		jsonResponse["EVENTS"] = []
		for event in eventsArray:
			jsonResponse["EVENTS"].append(event.toJson())

		return cc.createResponse(jsonResponse, 200)

	#@get /remove;
	@staticmethod
	def remove(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['id'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["id"]

		eventsModel = EventsRepository.findById(id)
		EventsRepository.delete(eventsModel)

		return cc.createResponse({'STATUS': 'Event has been removed'}, 200)

