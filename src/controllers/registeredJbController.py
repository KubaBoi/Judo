#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc

from src.repositories.registeredJbRepository import RegisteredJbRepository

#@controller /registeredJb;
class RegisteredJbController(cc):

	#@post /create;
	@staticmethod
	def create(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['REG_CLUB_ID', 'JB_ID'], args)):
			raise BadRequest("Wrong json structure")

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
		args = cc.readArgs(server)

		if (not cc.validateJson(['ID', 'ARRIVE', 'DEPARTURE', 'TRANSPORT'], args)):
			raise BadRequest("Wrong json structure")

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

	#@get /getByRegisteredClub;
	@staticmethod
	def getByRegisteredClub(server, path, auth):
		args = cc.getArgs(path)
		cc.checkJson(["regClubId"], args)

		regClubId = args["regClubId"]

		registeredjbArray = RegisteredJbRepository.findBy("reg_club_id", regClubId)

		return cc.createResponse({"REGISTERED_JBS": cc.modulesToJsonArray(registeredjbArray)})

	#@post /remove;
	@staticmethod
	def remove(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['ID'], args)):
			raise BadRequest("Wrong json structure")

		id = args["ID"]

		registeredjbModel = RegisteredJbRepository.findById(id)
		RegisteredJbRepository.delete(registeredjbModel)

		return cc.createResponse({'STATUS': 'JB has been removed from registration'}, 200)

