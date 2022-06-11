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

		if (not cc.validateJson(['CLUB_ID', 'JB', 'NAME', 'SUR_NAME', 'FUNCTION', 'BIRTHDAY', 'GENDER', 'PASS_ID', 'PASS_RELEASE', 'PASS_EXPIRATION'], args)):
			raise BadRequest("Wrong json structure")

		jbModel = JbRepository.model()
		jbModel.toModel(args)
		JbRepository.save(jbModel)

		return cc.createResponse({"ID": jbModel.id}, 200)


	#@post /createFromCvs;
	@staticmethod
	def createFromCvs(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(["EVENT_ID", "CLUB_ID", "DATA"], args)):
			raise BadRequest("Wrong json structure")

		eventId = args["EVENT_ID"]
		clubId = args["CLUB_ID"]
		data = args["DATA"]

		"""orFilter = ""
		dataLen = len(data)-1
		for i, oneJb in enumerate(data):
			orFilter += f"jb='{oneJb['JB']}'"
			if (i < dataLen):
				orFilter += " or "

		if (JbRepository.existsAny(orFilter)):
			raise Conflict("Some id from JudoBase already exists")"""

		for oneJB in data:
			model = JbRepository.model()
			model.toModel(oneJB)
			model.setAttrs(
				club_id=clubId,
				pass_release=None,
				pass_expiration=None
			)
			JbRepository.save(model)

		regClub = RegisteredClubsRepository.registeredClubInEvent(eventId, clubId)
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


	#@get /getByClub;
	@staticmethod
	def getByClub(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['clubId'], args)):
			raise BadRequest("Wrong json structure")

		clubId = args["clubId"]

		jbArray = JbRepository.findBy("club_id", clubId)
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


