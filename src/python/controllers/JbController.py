#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

from cheese.resourceManager import ResMan
from cheese.ErrorCodes import Error
from cheese.modules.cheeseController import CheeseController as cc

from python.repositories.JbRepository import JbRepository

from python.models.Jb import Jb

from python.cvsParser import CVSparser

#@controller /jb
class JbController(cc):

	#@post /create
	@staticmethod
	def create(server, path, auth):
		if (auth["role"] > 1):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['CLUB_ID', 'JB', 'NAME', 'SUR_NAME', 'FUNCTION', 'BIRTHDAY', 'GENDER', 'PASS_ID', 'PASS_RELEASE', 'PASS_EXPIRATION'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		clubId = args["CLUB_ID"]
		jb = args["JB"]
		name = args["NAME"]
		surName = args["SUR_NAME"]
		function = args["FUNCTION"]
		birthday = args["BIRTHDAY"]
		gender = args["GENDER"]
		passId = args["PASS_ID"]
		passRelease = args["PASS_RELEASE"]
		passExpiration = args["PASS_EXPIRATION"]

		newId = JbRepository.findNewId()
		jbModel = Jb()
		jbModel.id = newId
		jbModel.club_id = clubId
		jbModel.jb = jb
		jbModel.name = name
		jbModel.sur_name = surName
		jbModel.function = function
		jbModel.birthday = birthday
		jbModel.gender = gender
		jbModel.pass_id = passId
		jbModel.pass_release = passRelease
		jbModel.pass_expiration = passExpiration
		JbRepository.save(jbModel)

		response = cc.createResponse({"ID": newId}, 200)
		cc.sendResponse(server, response)

	#@post /createFromCvs
	@staticmethod
	def createFromCvs(server, path, auth):
		if (auth["role"] > 1):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readBytes(server)

		if (not args):
			Error.sendCustomError(server, "There are no bytes in request", 400)
			return

		name = "cvs"
		fileName = name
		i = 0
		while (os.path.exists(os.path.join(ResMan.resources(), fileName + ".txt"))):
			i += 1
			fileName = name + str(i)

		with open(f"{ResMan.resources()}/{fileName}.txt", "wb") as f:
			f.write(args)

		response = cc.createResponse({"FILE_NAME": fileName + ".txt"}, 200)
		cc.sendResponse(server, response)

	#@post /createByCvs
	@staticmethod
	def createFromCvs(server, path, auth):
		if (auth["role"] > 1):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(["FILE_NAME", "CLUB_ID"], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		clubId = args["CLUB_ID"]
		fileName = args["FILE_NAME"]
		jbsArray = CVSparser.parse(fileName)

		for jb in jbsArray:
			newId = JbRepository.findNewId()
			jbModel = Jb()
			jbModel.id = newId
			jbModel.club_id = clubId
			jbModel.birthday = jb["BIRTHDAY"]
			jbModel.name = jb["NAME"]
			jbModel.sur_name = jb["SUR_NAME"]
			jbModel.function = jb["FUNCTION"]
			jbModel.gender = jb["GENDER"]
			jbModel.jb = jb["JB"]
			JbRepository.save(jbModel)

		response = cc.createResponse({"STATUS": "JBs have been created"}, 200)
		cc.sendResponse(server, response)


	#@post /update
	@staticmethod
	def update(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['ID', 'CLUB_ID', 'JB', 'NAME', 'SUR_NAME', 'FUNCTION', 'BIRTHDAY', 'GENDER', 'PASS_ID', 'PASS_RELEASE', 'PASS_EXPIRATION'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["ID"]
		clubId = args["CLUB_ID"]
		jb = args["JB"]
		name = args["NAME"]
		surName = args["SUR_NAME"]
		function = args["FUNCTION"]
		birthday = args["BIRTHDAY"]
		gender = args["GENDER"]
		passId = args["PASS_ID"]
		passRelease = args["PASS_RELEASE"]
		passExpiration = args["PASS_EXPIRATION"]

		jbModel = JbRepository.findById(id)
		jbModel.id = id
		jbModel.club_id = clubId
		jbModel.jb = jb
		jbModel.name = name
		jbModel.sur_name = surName
		jbModel.function = function
		jbModel.birthday = birthday
		jbModel.gender = gender
		jbModel.pass_id = passId
		jbModel.pass_release = passRelease
		jbModel.pass_expiration = passExpiration
		JbRepository.update(jbModel)

		response = cc.createResponse({'STATUS': 'Jb has been updated'}, 200)
		cc.sendResponse(server, response)

	#@get /getByClub
	@staticmethod
	def getByClub(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['CLUB_ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		clubId = args["CLUB_ID"]

		jbArray = JbRepository.findBy("columnName-club_id", clubId)
		jsonResponse = {}
		jsonResponse["JBS"] = []
		for jb in jbArray:
			jsonResponse["JBS"].append(jb.toJson())

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

		jbModel = JbRepository.findById(id)
		JbRepository.delete(jbModel)

		response = cc.createResponse({'STATUS': 'Jb has been removed'}, 200)
		cc.sendResponse(server, response)

