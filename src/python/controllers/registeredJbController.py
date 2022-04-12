#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.ErrorCodes import Error
from cheese.modules.cheeseController import CheeseController as cc

from python.repositories.registeredJbRepository import RegisteredJbRepository

from python.models.registeredJb import RegisteredJb

#@controller /registeredJb
class RegisteredJbController(cc):

	#@post /create
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

		newId = RegisteredJbRepository.findNewId()
		registeredjbModel = RegisteredJb()
		registeredjbModel.id = newId
		registeredjbModel.reg_club_id = regClubId
		registeredjbModel.jb_id = jbId
		RegisteredJbRepository.save(registeredjbModel)

		response = cc.createResponse({"ID": newId}, 200)
		cc.sendResponse(server, response)

	#@post /update
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
		registeredjbModel.id = id
		registeredjbModel.arrive = arrive
		registeredjbModel.departure = departure
		registeredjbModel.transport = transport
		RegisteredJbRepository.update(registeredjbModel)

		response = cc.createResponse({'STATUS': 'Jb has been updated'}, 200)
		cc.sendResponse(server, response)

	#@post /getByRegisteredClub
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

		response = cc.createResponse(jsonResponse, 200)
		cc.sendResponse(server, response)

	#@post /remove
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

		response = cc.createResponse({'STATUS': 'JB has been removed from registration'}, 200)
		cc.sendResponse(server, response)

