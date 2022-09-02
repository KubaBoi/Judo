#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cmath import atanh
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
		cc.checkJson(["HARD_CREATE", "NAME", "CATEGORY", "PLACE", "EVENT_START", "EVENT_END", "ARRIVE", "DEPART", "END_VISA", "END_ROOM", "ORGANISER_ID", "VISA_MAIL", "VISA_PHONE", "EJU_PRICE", "PCR_PRICE", "AG_PRICE", "TRANS_PRICE", "OTHER_PRICE", "SHOW_HOTEL", "HOTELS"], args)

		hardCreate = args["HARD_CREATE"]
		name = args["NAME"]

		exists = EventsRepository.findWhere(name=name)
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
		cc.checkJson(["ID", "NAME", "CATEGORY", "PLACE", "EVENT_START", "EVENT_END", "ARRIVE", "DEPART", "END_VISA", "END_ROOM", "ORGANISER_ID", "VISA_MAIL", "VISA_PHONE", "EJU_PRICE", "PCR_PRICE", "AG_PRICE", "TRANS_PRICE", "OTHER_PRICE", "SHOW_HOTEL", "HOTELS"], args)

		id = args["ID"]
		
		eventsModel = EventsRepository.find(id)
		eventsModel.toModel(args)
		EventsRepository.update(eventsModel)

		return cc.createResponse({"STATUS": "Event has been changed"}, 200)

	#@get /get;
	@staticmethod
	def get(server, path, auth):
		args = cc.getArgs(path)
		cc.checkJson(["eventId"], args)

		id = args["eventId"]

		event = EventsRepository.find(id)
		if (event == None):
			raise NotFound("Event was not found")

		jsonResponse = {}
		jsonResponse["EVENT"] = event.toJson()

		return cc.createResponse(jsonResponse, 200)

	#@get /getByOrganiser;
	@staticmethod
	def getByOrganiser(server, path, auth):
		events = EventsRepository.findWhere(organiser_id=auth["userData"][0])

		return cc.createResponse({"EVENTS": cc.modulesToJsonArray(events)})

	#@get /getByOrganiserAllData;
	@staticmethod
	def getByOrganiserAllData(server, path, auth):
		events = EventsRepository.findWhere(organiser_id=auth["userData"][0])

		for event in events:
			regClubs = RegisteredClubsRepository.findWhere(event_id=event.id)
			for regClub in regClubs:
				club = ClubsRepository.find(regClub.club_id)
				setattr(regClub, "CLUB", club)
			setattr(event, "REG_CLUBS", regClubs)

		return cc.createResponse({"EVENTS": cc.modulesToJsonArray(events)})

	#@get /getBy;
	@staticmethod
	def getBy(server, path, auth):
		args = cc.getArgs(path)
		cc.checkJson(["column", "clubId"], args)

		column = args["column"]
		userLogin = auth["login"]["login"]
		user = UsersRepository.findOneWhere(login=userLogin)
		if (user == None):
			raise NotFound("User was not found")

		usersClub = ClubsRepository.find(args["clubId"])

		eventsArray = EventsRepository.findBySorted(column)
		jsonResponse = {}
		jsonResponse["EVENTS"] = []
		for event in eventsArray:
			jsn = event.toJson()

			status = 3
			if (usersClub != None):
				if (RegisteredClubsRepository.isClubRegisteredInEvent(event.id, usersClub.id)):
					status = RegisteredClubsRepository.registeredClubInEvent(event.id, usersClub.id).status

			jsn["STATUS"] = status
			jsonResponse["EVENTS"].append(jsn)

		return cc.createResponse(jsonResponse, 200)

	#@post /remove;
	@staticmethod
	def remove(server, path, auth):
		args = cc.readArgs(server)
		cc.checkJson(["EVENT_ID"], args)

		id = args["EVENT_ID"]

		eventsModel = EventsRepository.find(id)
		EventsRepository.delete(eventsModel)

		return cc.createResponse({"STATUS": "Event has been removed"}, 200)

