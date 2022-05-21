#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc

from src.repositories.eventsRepository import EventsRepository
from src.repositories.usersRepository import UsersRepository
from src.repositories.clubsRepository import ClubsRepository
from src.repositories.registeredClubsRepository import RegisteredClubsRepository

#@controller /events;
class EventsController(cc):

	#@post /create;
	@staticmethod
	def create(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['HARD_CREATE', 'NAME', 'CATEGORY', 'PLACE', 'EVENT_START', 'EVENT_END', 'ARRIVE', 'DEPART', 'END_VISA', 'END_ROOM', 'ORGANISER_ID', 'VISA_MAIL', 'VISA_PHONE', 'EJU_PRICE', 'PCR_PRICE', 'AG_PRICE', 'TRANS_PRICE', 'OTHER_PRICE', 'SHOW_HOTEL', 'HOTELS'], args)):
			raise BadRequest("Wrong json structure")

		hardCreate = args["HARD_CREATE"]
		name = args["NAME"]

		exists = EventsRepository.findBy("name", name)
		if (exists == None):
			return
		if (len(exists) > 0 and not hardCreate):
			raise Conflict("Event already exists")

		eventsModel = EventsRepository.model()
		eventsModel.toModel(args)
		EventsRepository.save(eventsModel)

		return cc.createResponse({"ID": eventsModel.id}, 200)

	#@post /update;
	@staticmethod
	def update(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['ID', 'NAME', 'CATEGORY', 'PLACE', 'START', 'END', 'ARRIVE', 'DEPART', 'END_VISA', 'END_ROOM', 'ORGANISER_ID', 'VISA_MAIL', 'VISA_PHONE', 'EJU_PRICE', 'PCR_PRICE', 'AG_PRICE', 'TRANS_PRICE', 'OTHER_PRICE', 'SHOW_HOTEL', 'HOTELS'], args)):
			raise BadRequest("Wrong json structure")

		id = args["ID"]
		
		eventsModel = EventsRepository.find(id)
		eventsModel.toModel(args)
		EventsRepository.update(eventsModel)

		return cc.createResponse({'STATUS': 'Event has been changed'}, 200)

	#@get /get;
	@staticmethod
	def get(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['eventId'], args)):
			raise BadRequest("Wrong json structure")

		id = args["eventId"]

		event = EventsRepository.find(id)
		if (event == None):
			raise NotFound("Event was not found")

		jsonResponse = {}
		jsonResponse["EVENT"] = event.toJson()

		return cc.createResponse(jsonResponse, 200)

	#@get /getBy;
	@staticmethod
	def getBy(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(["column"], args)):
			raise BadRequest("Wrong json structure")

		column = args["column"]
		userLogin = auth["login"]["login"]
		user = UsersRepository.findOneBy("login", userLogin)
		if (user == None):
			raise NotFound("User was not found")

		usersClubs = ClubsRepository.findBy("user_id", user.id)

		eventsArray = EventsRepository.findBySorted(column)
		jsonResponse = {}
		jsonResponse["EVENTS"] = []
		for event in eventsArray:
			jsn = event.toJson()

			status = 3
			for club in usersClubs:
				if (RegisteredClubsRepository.isClubRegisteredInEvent(event.id, club.id)):
					status = RegisteredClubsRepository.registeredClubInEvent(event.id, club.id).status
					break

			jsn["STATUS"] = status
			jsonResponse["EVENTS"].append(jsn)

		return cc.createResponse(jsonResponse, 200)

	#@post /remove;
	@staticmethod
	def remove(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['EVENT_ID'], args)):
			raise BadRequest("Wrong json structure")

		id = args["EVENT_ID"]

		eventsModel = EventsRepository.find(id)
		EventsRepository.delete(eventsModel)

		return cc.createResponse({'STATUS': 'Event has been removed'}, 200)

