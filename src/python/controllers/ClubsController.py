#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.ErrorCodes import Error
from cheese.modules.cheeseController import CheeseController as cc

from python.repositories.ClubsRepository import ClubsRepository

from python.models.Clubs import Clubs

#@controller /clubs
class ClubsController(cc):

	#@post /create
	@staticmethod
	def create(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['STATE', 'NAME', 'ADDRESS', 'EJU', 'USER_ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		state = args["STATE"]
		name = args["NAME"]
		address = args["ADDRESS"]
		eju = args["EJU"]
		userId = args["USER_ID"]

		newId = ClubsRepository.findNewId()
		clubsModel = Clubs()
		clubsModel.id = newId
		clubsModel.state = state
		clubsModel.name = name
		clubsModel.address = address
		clubsModel.eju = eju
		clubsModel.user_id = userId
		ClubsRepository.save(clubsModel)

		response = cc.createResponse({"ID": newId}, 200)
		cc.sendResponse(server, response)

	#@post /update
	@staticmethod
	def update(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['ID', 'STATE', 'NAME', 'ADDRESS', 'EJU', 'USER_ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["ID"]
		state = args["STATE"]
		name = args["NAME"]
		address = args["ADDRESS"]
		eju = args["EJU"]
		userId = args["USER_ID"]

		clubsModel = ClubsRepository.findById(id)
		clubsModel.id = id
		clubsModel.state = state
		clubsModel.name = name
		clubsModel.address = address
		clubsModel.eju = eju
		clubsModel.user_id = userId
		ClubsRepository.update(clubsModel)

		response = cc.createResponse({'STATUS': 'Club has been updated'}, 200)
		cc.sendResponse(server, response)

	#@get /getAll
	@staticmethod
	def getAll(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		clubsArray = ClubsRepository.findAll()
		jsonResponse = {}
		jsonResponse["CLUBS"] = []
		for club in clubsArray:
			jsonResponse["CLUBS"].append(club.toJson())

		response = cc.createResponse(jsonResponse, 200)
		cc.sendResponse(server, response)

	#@post /getByUser
	@staticmethod
	def getByUser(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['USER_ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		userId = args["USER_ID"]

		clubsArray = ClubsRepository.findBy("columnName-user_id", userId)
		jsonResponse = {}
		jsonResponse["CLUBS"] = []
		for club in clubsArray:
			jsonResponse["CLUBS"].append(club.toJson())

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

		clubsModel = ClubsRepository.findById(id)
		ClubsRepository.delete(clubsModel)

		response = cc.createResponse({'STATUS': 'Club has been removed'}, 200)
		cc.sendResponse(server, response)

