#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.ErrorCodes import Error
from Cheese.cheeseController import CheeseController as cc

from src.repositories.clubsRepository import ClubsRepository

#@controller /clubs;
class ClubsController(cc):

	#@post /create;
	@staticmethod
	def create(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['STATE', 'NAME', 'ADDRESS', 'EJU', 'USER_ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		state = args["STATE"]
		name = args["NAME"]
		address = args["ADDRESS"]
		eju = args["EJU"]
		userId = args["USER_ID"]

		clubsModel = ClubsRepository.model()
		clubsModel.setAttrs(
			state=state,
			name=name,
			address=address,
			eju=eju,
			user_id=userId
		)
		ClubsRepository.save(clubsModel)

		return cc.createResponse({"ID": clubsModel.id}, 200)

	#@post /update;
	@staticmethod
	def update(server, path, auth):
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
		clubsModel.state = state
		clubsModel.name = name
		clubsModel.address = address
		clubsModel.eju = eju
		clubsModel.user_id = userId
		ClubsRepository.update(clubsModel)

		return cc.createResponse({'STATUS': 'Club has been updated'}, 200)

	#@get /get;
	@staticmethod
	def get(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(["id"], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["id"]

		club = ClubsRepository.find(id)
		if (club == None):
			Error.sendCustomError(server, "Club was not found", 404)
			return

		jsonResponse = club.toJson()

		return cc.createResponse({"CLUB": jsonResponse}, 200)

	#@get /getAll;
	@staticmethod
	def getAll(server, path, auth):
		clubsArray = ClubsRepository.findAll()
		jsonResponse = {}
		jsonResponse["CLUBS"] = []
		for club in clubsArray:
			jsonResponse["CLUBS"].append(club.toJson())

		return cc.createResponse(jsonResponse, 200)

	#@get /getByUser;
	@staticmethod
	def getByUser(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['userId'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		userId = int(args["userId"])

		clubsArray = ClubsRepository.findBy("columnName-user_id", userId)
		jsonResponse = {}
		jsonResponse["CLUBS"] = []
		for club in clubsArray:
			jsonResponse["CLUBS"].append(club.toJson())

		return cc.createResponse(jsonResponse, 200)

	#@post /remove;
	@staticmethod
	def remove(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["ID"]

		clubsModel = ClubsRepository.findById(id)
		ClubsRepository.delete(clubsModel)

		return cc.createResponse({'STATUS': 'Club has been removed'}, 200)

