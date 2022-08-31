#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc

from src.repositories.jbRepository import JbRepository
from src.repositories.registeredClubsRepository import RegisteredClubsRepository

#@controller /jb;
class JbController(cc):

	#@post /create;
	@staticmethod
	def create(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['JB', 'NAME', 'SUR_NAME', 'FUNCTION', 'BIRTHDAY', 'GENDER', 'PASS_ID', 'PASS_RELEASE', 'PASS_EXPIRATION'], args)):
			raise BadRequest("Wrong json structure")

		jbModel = JbRepository.model()
		jbModel.toModel(args)
		JbRepository.save(jbModel)

		return cc.createResponse({"ID": jbModel.id}, 200)

	#@post /createFromCvs;
	@staticmethod
	def createFromCvs(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(["EVENT_ID", "DATA"], args)):
			raise BadRequest("Wrong json structure")

		eventId = args["EVENT_ID"]
		data = args["DATA"]

		for oneJB in data:
			model = JbRepository.model()
			model.toModel(oneJB)
			model.setAttrs(
				pass_release=None,
				pass_expiration=None
			)
			JbRepository.save(model)

		regClubs = RegisteredClubsRepository.findByColumns(event_id=eventId, status=0)
		for regClub in regClubs:
			regClub.status = 1
			RegisteredClubsRepository.update(regClub)

		return cc.createResponse({"STATUS": "OK"}, 200)

	#@post /update;
	@staticmethod
	def update(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['ID', 'CLUB_ID', 'JB', 'NAME', 'SUR_NAME', 'FUNCTION', 'BIRTHDAY', 'GENDER', 'PASS_ID', 'PASS_RELEASE', 'PASS_EXPIRATION'], args)):
			raise BadRequest("Wrong json structure")

		id = args["ID"]

		jbModel = JbRepository.find(id)
		jbModel.toModel(args)
		JbRepository.update(jbModel)

		return cc.createResponse({'STATUS': 'Jb has been updated'}, 200)

	#@get /get;
	@staticmethod
	def get(server, path, auth):
		args = cc.getArgs(path)
		cc.checkJson(["jbId"], args)

		jb = JbRepository.find(args["jbId"])
		if (jb == None):
			raise NotFound("Jb was not found")

		return cc.createResponse({"JB": jb.toJson()})


	#@get /getByClub;
	@staticmethod
	def getByClub(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['clubId'], args)):
			raise BadRequest("Wrong json structure")

		clubId = args["clubId"]

		jbArray = JbRepository.findByColumns(club_id=clubId)
		jsonResponse = {}
		jsonResponse["JBS"] = []
		for jb in jbArray:
			jsonResponse["JBS"].append(jb.toJson())

		return cc.createResponse(jsonResponse, 200)


	#@post /remove;
	@staticmethod
	def remove(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['ID'], args)):
			raise BadRequest("Wrong json structure")

		id = args["ID"]

		jbModel = JbRepository.findById(id)
		JbRepository.delete(jbModel)

		return cc.createResponse({'STATUS': 'Jb has been removed'}, 200)


