#!/usr/bin/env python
# -*- coding: utf-8 -*-

import random
import string
import os
import json

from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc
from Cheese.resourceManager import ResMan

from src.repositories.registeredClubsRepository import RegisteredClubsRepository

from src.repositories.usersRepository import UsersRepository
from src.repositories.clubsRepository import ClubsRepository
from src.repositories.tokensRepository import TokensRepository
from src.repositories.passwordsRepository import PasswordsRepository
from src.repositories.registrationsRepository import RegistrationsRepository

from src.emailSender import EmailSender

#@controller /users;
class UsersController(cc):

	#@get /login;
	@staticmethod
	def login(server, path, auth):
		login = auth["login"]["login"]

		user = UsersRepository.findOneBy("login", login)
		club = ClubsRepository.findOneBy("user_id", user.id)
		if (club != None):
			club = club.toJson()

		return cc.createResponse({"USER": user.toJson(), "CLUB": club}, 200)

	#@post /register;
	@staticmethod
	def register(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['LOGIN', 'PASSWORD', 'PHONE', 'FULL_NAME'], args)):
			raise BadRequest("Wrong json structure")

		login = args["LOGIN"]
		password = args["PASSWORD"]
		phone = args["PHONE"]
		fullName = args["FULL_NAME"]

		user = UsersRepository.findOneBy("login", login)
		if (user != None):
			raise Conflict("User with this login already exists")

		randomCode = UsersController.randomString(20)

		registration = RegisteredClubsRepository.model()
		print(registration.toJson())
		registration.login = login
		registration.password = password
		registration.phone = phone
		registration.full_name = fullName
		registration.registration_code = randomCode
		RegistrationsRepository.save(registration)

		with open(os.path.join(ResMan.web(), "registrations", "regTemplate.html"), "r") as f:
			template = f.read()

		with open(os.path.join(ResMan.web(), "registrations", "reg" + randomCode + ".html"), "w") as f:
			template = template.replace("&CODE&", randomCode)
			f.write(template)

		EmailSender.sendRegistrationEmail(login, randomCode)

		return cc.createResponse({'STATUS': "Confirmation has been created"}, 200)

	#@get /create;
	@staticmethod
	def create(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['code'], args)):
			raise BadRequest("Wrong json structure")

		code = args["code"]
		registration = RegistrationsRepository.findOneBy("registration_code", code)
		if (registration == None):
			raise Unauthorized("Registration is invalid")

		if (code != registration.registration_code):
			raise Unauthorized("Registration is invalid")

		login = registration.login
		password = registration.password
		phone = registration.phone
		fullName = registration.full_name

		usersModel = UsersRepository.model()
		usersModel.login = login
		usersModel.phone = phone
		usersModel.full_name = fullName
		usersModel.role_id = 2
		UsersRepository.save(usersModel)

		passwordsModel = PasswordsRepository.model()
		passwordsModel.password = password
		passwordsModel.login = login
		PasswordsRepository.save(passwordsModel)

		RegistrationsRepository.delete(registration)
		os.remove(ResMan.web("registrations", "reg" + code + ".html"))

		return cc.createResponse({"STATUS": "User has been created"}, 200)

	#@get /get;
	@staticmethod
	def get(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['userId'], args)):
			raise BadRequest("Wrong json structure")

		userId = args["userId"]

		usersModel = UsersRepository.find(userId)
		jsonResponse = {}
		jsonResponse["USER"] = usersModel.toJson()

		return cc.createResponse(jsonResponse, 200)

	
	# METHODS

	@staticmethod
	def getToken(userId, userIp):
		token = TokensRepository.findToken(userId, userIp)
		if (token == None):
			tokenString = UsersController.randomString(10)
			oldToken = TokensRepository.findBy("token", tokenString)
			while (len(oldToken) > 0):
				tokenString = UsersController.randomString(10)
				oldToken = TokensRepository.findBy("token", tokenString)
			
			token = TokensRepository.model()
			token.token = tokenString
			token.user_id = userId
			token.ip = userIp
			TokensRepository.save(token)
		return token

	@staticmethod
	def randomString(length):
		return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))
		

