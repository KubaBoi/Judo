#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc

from src.repositories.clubsRepository import ClubsRepository

#@controller /clubs;
class ClubsController(cc):

	#@post /create;
	@staticmethod
	def create(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['STATE', 'NAME', 'ADDRESS', 'EJU', 'USER_ID'], args)):
			raise BadRequest("Wrong json structure")

		clubsModel = ClubsRepository.model()
		clubsModel.toModel(args)
		ClubsRepository.save(clubsModel)

		return cc.createResponse({"ID": clubsModel.id}, 200)

	#@post /update;
	@staticmethod
	def update(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['ID', 'STATE', 'NAME', 'ADDRESS', 'EJU', 'USER_ID'], args)):
			raise BadRequest("Wrong json structure")

		id = args["ID"]

		clubsModel = ClubsRepository.findBy(id)
		clubsModel.toModel(args)
		ClubsRepository.update(clubsModel)

		return cc.createResponse({'STATUS': 'Club has been updated'}, 200)

	#@get /get;
	@staticmethod
	def get(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(["clubId"], args)):
			raise BadRequest("Wrong json structure")

		id = args["clubId"]

		club = ClubsRepository.find(id)
		if (club == None):
			raise NotFound("Club was not found")

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
			raise BadRequest("Wrong json structure")

		userId = int(args["userId"])

		clubsArray = ClubsRepository.findBy("user_id", userId)
		jsonResponse = {}
		jsonResponse["CLUBS"] = []
		for club in clubsArray:
			jsonResponse["CLUBS"].append(club.toJson())

		return cc.createResponse(jsonResponse, 200)

	#@post /remove;
	@staticmethod
	def remove(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['CLUB_ID'], args)):
			raise BadRequest("Wrong json structure")

		id = args["CLUB_ID"]

		clubsModel = ClubsRepository.find(id)
		ClubsRepository.delete(clubsModel)

		return cc.createResponse({'STATUS': 'Club has been removed'}, 200)

