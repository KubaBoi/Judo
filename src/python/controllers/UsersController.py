#!/usr/bin/env python
# -*- coding: utf-8 -*-

import random
import string

from cheese.ErrorCodes import Error
from cheese.modules.cheeseController import CheeseController as cc
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
		userIp = cc.getClientAddress(server)
		token = UsersController.getToken(user.id, userIp)

		response = cc.createResponse({'TOKEN': token.toJson()}, 200)
		cc.sendResponse(server, response)

	#@post /create
	@staticmethod
	def create(server, path, auth):
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

		newId = UsersRepository.findNewId()
		usersModel = Users()
		usersModel.id = newId
		usersModel.login = login
		usersModel.phone = phone
		usersModel.full_name = fullName
		usersModel.rule_id = 2
		UsersRepository.save(usersModel)

		newPassId = PasswordsRepository.findNewId()
		passwordsModel = Passwords(newPassId, password, login)
		PasswordsRepository.save(passwordsModel)

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

	
	# METHODS

	@staticmethod
	def getToken(userId, userIp):
		token = TokensRepository.findToken(userId, userIp)
		if (token == None):
			tokenString = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
			oldToken = TokensRepository.findBy("columnName-token", tokenString)
			while (oldToken != None):
				tokenString = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
				oldToken = TokensRepository.findBy("columnName-token", tokenString)
			
			token = Tokens()
			token.id = TokensRepository.findNewId()
			token.token = tokenString
			token.user_id = userId
			token.ip = userIp
			TokensRepository.save(token)
		return token
		

