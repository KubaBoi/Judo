#!/usr/bin/env python
# -*- coding: utf-8 -*-

import random
import string
import os
import json

from cheese.ErrorCodes import Error
from cheese.modules.cheeseController import CheeseController as cc
from cheese.resourceManager import ResMan
from python.models.Passwords import Passwords

from python.repositories.UsersRepository import UsersRepository
from python.repositories.TokensRepository import TokensRepository
from python.repositories.PasswordsRepository import PasswordsRepository

from python.models.Users import Users
from python.models.Tokens import Tokens

#@controller /users
class UsersController(cc):

	#@get /login
	@staticmethod
	def login(server, path, auth):
		args = cc.getCookies(server)

		if (not cc.validateJson(['login', 'password'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		login = args["login"]
		password = args["password"]

		if (not PasswordsRepository.login(login, password)):
			Error.sendCustomError(server, "Wrong credentials", 401)
			return

		user = UsersRepository.findBy("columnName-login", login)
		if (len(user) > 0):
			user = user[0]
		userIp = cc.getClientAddress(server)
		token = UsersController.getToken(user.id, userIp)

		response = cc.createResponse({'TOKEN': token.toJson()}, 200)
		cc.sendResponse(server, response)

	#@post /register
	@staticmethod
	def register(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['LOGIN', 'PASSWORD', 'PHONE', 'FULL_NAME'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		login = args["LOGIN"]
		password = args["PASSWORD"]
		phone = args["PHONE"]
		fullName = args["FULL_NAME"]
		randomCode = UsersController.randomString(20)

		registration = {
			"login": login,
			"password": password,
			"phone": phone,
			"fullName": fullName,
			"password": password,
			"registration_code": randomCode
		}

		with open(os.path.join(ResMan.resources(), "registrations", randomCode + ".json"), "w") as f:
			f.write(json.dumps(registration))

		with open(os.path.join(ResMan.web(), "registrations", "regTemplate.html"), "r") as f:
			template = f.read()

		with open(os.path.join(ResMan.web(), "registrations", "reg" + randomCode + ".html"), "w") as f:
			template = template.replace("&CODE&", randomCode)
			f.write(template)

		response = cc.createResponse({'STATUS': "Confirmation has been created"}, 200)
		cc.sendResponse(server, response)

	#@get /create
	@staticmethod
	def create(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 401)
			return

		args = cc.getArgs(path)

		if (not cc.validateJson(['code'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		code = args["code"]
		if (not os.path.exists(os.path.join(ResMan.resources(), "registrations", code + ".json"))):
			Error.sendCustomError(server, "Registration is invalid", 401)
			return

		with open(os.path.join(ResMan.resources(), "registrations", code + ".json"), "r") as f:
			data = json.loads(f.read())

		if (code != data["registration_code"]):
			Error.sendCustomError(server, "Registration is invalid", 401)
			return

		login = data["login"]
		password = data["password"]

		newId = UsersRepository.findNewId()
		usersModel = Users()
		usersModel.id = newId
		usersModel.login = login
		usersModel.phone = data["phone"]
		usersModel.full_name = data["fullName"]
		usersModel.rule_id = 2
		UsersRepository.save(usersModel)

		newPassId = PasswordsRepository.findNewId()
		passwordsModel = Passwords(newPassId, password, login)
		PasswordsRepository.save(passwordsModel)

		response = cc.createResponse({"STATUS": "User has been created"}, 200)
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

	
	# METHODS

	@staticmethod
	def getToken(userId, userIp):
		token = TokensRepository.findToken(userId, userIp)
		if (token == None):
			tokenString = UsersController.randomString(10)
			oldToken = TokensRepository.findBy("columnName-token", tokenString)
			while (len(oldToken) > 0):
				tokenString = UsersController.randomString(10)
				oldToken = TokensRepository.findBy("columnName-token", tokenString)
			
			token = Tokens()
			token.id = TokensRepository.findNewId()
			token.token = tokenString
			token.user_id = userId
			token.ip = userIp
			TokensRepository.save(token)
		return token

	@staticmethod
	def randomString(length):
		return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))
		

