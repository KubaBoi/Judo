#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc
from Cheese.cheeseRepository import CheeseRepository as cr

from src.repositories.jbRepository import JbRepository
from src.repositories.registeredClubsRepository import RegisteredClubsRepository

#@controller /jb;
class JbController(cc):

	#@post /create;
	@staticmethod
	def create(server, path, auth):
		args = cc.readArgs(server)
		cc.checkJson(["JB", "NAME", "SUR_NAME", "FUNCTION", "BIRTHDAY", "GENDER", "PASS_ID", "PASS_RELEASE", "PASS_EXPIRATION"], args)

		jbModel = JbRepository.model()
		jbModel.toModel(args)
		JbRepository.save(jbModel)

		return cc.createResponse({"ID": jbModel.id}, 200)

	#@post /createFromCvs;
	@staticmethod
	def createFromCvs(server, path, auth):
		args = cc.readArgs(server)
		cc.checkJson(["EVENT_ID", "DATA"], args)

		eventId = args["EVENT_ID"]
		data = args["DATA"]

		cr.disableAutocommit()
		try:
			i = 0
			modelTemp = JbRepository.model()
			for oneJB in data:
				if (JbRepository.exists(jb=oneJB["JB"])):
					model = JbRepository.findOneWhere(jb=oneJB["JB"])
					model.toModel(oneJB)
					model.setAttrs(
						pass_release=None,
						pass_expiration=None
					)
					JbRepository.update(model)
				else:
					model = modelTemp
					model.id += i
					i += 1
					model.toModel(oneJB)
					model.setAttrs(
						pass_release=None,
						pass_expiration=None
					)
					JbRepository.save(model)

			regClubs = RegisteredClubsRepository.findWhere(event_id=eventId, status=0)
			for regClub in regClubs:
				regClub.status = 1
				RegisteredClubsRepository.update(regClub)
			
			cr.commit()
			cr.enableAutocommit()
		except Exception as e:
			cr.enableAutocommit()
			raise e

		return cc.createResponse({"STATUS": "OK"}, 200)

	#@post /update;
	@staticmethod
	def update(server, path, auth):
		args = cc.readArgs(server)
		cc.checkJson(["ID", "NAME", "SUR_NAME", "FUNCTION", "PASS_ID", "PASS_RELEASE", "PASS_EXPIRATION"], args)

		id = args["ID"]

		jbModel = JbRepository.find(id)
		jbModel.toModel(args)
		JbRepository.update(jbModel)

		return cc.createResponse({"STATUS": "Jb has been updated"}, 200)

	#@get /get;
	@staticmethod
	def get(server, path, auth):
		args = cc.getArgs(path)
		cc.checkJson(["jbId"], args)

		jb = JbRepository.find(args["jbId"])
		if (jb == None):
			raise NotFound("Jb was not found")

		return cc.createResponse({"JB": jb.toJson()})

	#@get /getAll;
	@staticmethod
	def getAll(server, path, auth):
		jbs = JbRepository.findAllOrderByState()

		return cc.createResponse({"JBS": cc.modulesToJsonArray(jbs)})

	#@get /getByCountry;
	@staticmethod
	def getByCountry(server, path, auth):
		args = cc.getArgs(path)
		cc.checkJson(["country"], args)

		jbModels = JbRepository.findWhere(state=args["country"])
		return cc.createResponse({"JBS": cc.modulesToJsonArray(jbModels)})


	#@post /remove;
	@staticmethod
	def remove(server, path, auth):
		args = cc.readArgs(server)
		cc.checkJson(["ID"], args)

		id = args["ID"]

		jbModel = JbRepository.findById(id)
		JbRepository.delete(jbModel)

		return cc.createResponse({'STATUS': 'Jb has been removed'}, 200)


