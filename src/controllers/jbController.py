#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

from Cheese.resourceManager import ResMan
from Cheese.ErrorCodes import Error
from Cheese.cheeseController import CheeseController as cc

from src.repositories.jbRepository import JbRepository

from src.cvsParser import CVSparser

#@controller /jb;
class JbController(cc):

	#@post /create;
	@staticmethod
	def create(server, path, auth):
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

		jbModel = JbRepository.model()
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

		return cc.createResponse({"ID": jbModel.id}, 200)


	#@post /createFromCvs;
	@staticmethod
	def createFromCvs(server, path, auth):
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

		return cc.createResponse({"FILE_NAME": fileName + ".txt"}, 200)


	#@post /createByCvs;
	@staticmethod
	def createFromCvs(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(["FILE_NAME", "CLUB_ID"], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		clubId = args["CLUB_ID"]
		fileName = args["FILE_NAME"]
		jbsArray = CVSparser.parse(fileName)

		for jb in jbsArray:
			jbModel = JbRepository.model()
			jbModel.club_id = clubId
			jbModel.birthday = jb["BIRTHDAY"]
			jbModel.name = jb["NAME"]
			jbModel.sur_name = jb["SUR_NAME"]
			jbModel.function = jb["FUNCTION"]
			jbModel.gender = jb["GENDER"]
			jbModel.jb = jb["JB"]
			JbRepository.save(jbModel)

		return cc.createResponse({"STATUS": "JBs have been created"}, 200)



	#@post /update;
	@staticmethod
	def update(server, path, auth):
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

		return cc.createResponse({'STATUS': 'Jb has been updated'}, 200)


	#@get /getByClub;
	@staticmethod
	def getByClub(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['clubId'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

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
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["ID"]

		jbModel = JbRepository.findById(id)
		JbRepository.delete(jbModel)

		return cc.createResponse({'STATUS': 'Jb has been removed'}, 200)


