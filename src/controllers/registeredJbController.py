#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.ErrorCodes import Error
from Cheese.cheeseController import CheeseController as cc

from src.repositories.registeredJbRepository import RegisteredJbRepository

#@controller /registeredJb;
class RegisteredJbController(cc):

	#@post /create;
	@staticmethod
	def create(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['REG_CLUB_ID', 'JB_ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		regClubId = args["REG_CLUB_ID"]
		jbId = args["JB_ID"]

		registeredjbModel = RegisteredJbRepository.model()
		registeredjbModel.reg_club_id = regClubId
		registeredjbModel.jb_id = jbId
		RegisteredJbRepository.save(registeredjbModel)

		return cc.createResponse({"ID": registeredjbModel.id}, 200)

	#@post /update;
	@staticmethod
	def update(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['ID', 'ARRIVE', 'DEPARTURE', 'TRANSPORT'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["ID"]
		arrive = args["ARRIVE"]
		departure = args["DEPARTURE"]
		transport = args["TRANSPORT"]

		registeredjbModel = RegisteredJbRepository.findById(id)
		registeredjbModel.arrive = arrive
		registeredjbModel.departure = departure
		registeredjbModel.transport = transport
		RegisteredJbRepository.update(registeredjbModel)

		return cc.createResponse({'STATUS': 'Jb has been updated'}, 200)

	#@post /getByRegisteredClub;
	@staticmethod
	def getByRegisteredClub(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['REG_CLUB_ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		regClubId = args["REG_CLUB_ID"]

		registeredjbArray = RegisteredJbRepository.findBy("columnName-reg_club_id", regClubId)
		jsonResponse = {}
		jsonResponse["REGISTERED_JBS"] = []
		for registered_jb in registeredjbArray:
			jsonResponse["REGISTERED_JBS"].append(registered_jb.toJson())

		return cc.createResponse(jsonResponse, 200)

	#@post /remove;
	@staticmethod
	def remove(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["ID"]

		registeredjbModel = RegisteredJbRepository.findById(id)
		RegisteredJbRepository.delete(registeredjbModel)

		return cc.createResponse({'STATUS': 'JB has been removed from registration'}, 200)
