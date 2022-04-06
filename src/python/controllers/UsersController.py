#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.ErrorCodes import Error
from cheese.modules.cheeseController import CheeseController as cc

from python.repositories.UsersRepository import UsersRepository

from python.models.Users import Users

#@controller /users
class UsersController(cc):

	#@get /login
	@staticmethod
	def login(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Wrong credentials", 400)
			return

		args = cc.getCookies(server)

		if (not cc.validateJson(['LOGIN', 'PASSWORD'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		login = args["LOGIN"]
		password = args["PASSWORD"]

		response = cc.createResponse({'TOKEN': 'str'}, 200)
		cc.sendResponse(server, response)

	#@post /create
	@staticmethod
	def create(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['LOGIN', 'PASSWORD', 'PHONE', 'FULL_NAME', 'RULE_ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		login = args["LOGIN"]
		password = args["PASSWORD"]
		phone = args["PHONE"]
		fullName = args["FULL_NAME"]
		ruleId = args["RULE_ID"]

		newId = UsersRepository.findNewId()
		usersModel = Users()
		usersModel.id = newId
		usersModel.login = login
		usersModel.password = password
		usersModel.phone = phone
		usersModel.full_name = fullName
		usersModel.rule_id = ruleId
		UsersRepository.save(usersModel)

		response = cc.createResponse({"ID": newId}, 200)
		cc.sendResponse(server, response)

	#@post /get
	@staticmethod
	def get(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['USER_ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		userId = args["USER_ID"]

		usersModel = UsersRepository.find(userId)
		jsonResponse = {}
		jsonResponse["USER"] = usersModel.toJson()

		response = cc.createResponse(jsonResponse, 200)
		cc.sendResponse(server, response)

