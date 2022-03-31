#!/usr/bin/env python
# -*- coding: utf-8 -*-

import string
import random

from cheese.resourceManager import ResMan
from cheese.modules.cheeseController import CheeseController
from cheese.ErrorCodes import Error

from python.repositories.userRepository import UserRepository
from python.repositories.tokenRepository import TokenRepository

from python.models.User import User
from python.models.Token import Token 

#@controller /authentication
class AuthenticationController(CheeseController):

    #@get /login
    @staticmethod
    def login(server, path, auth):
        cookies = CheeseController.getCookies(server)

        if (not CheeseController.validateJson(("userName", "password"), cookies)):
            response = CheeseController.createResponse({"ERROR": "No cookies"}, 401)
            CheeseController.sendResponse(server, response)
            return

        userName = cookies["userName"]
        password = cookies["password"]
        if (userName == "" or password == ""):
            response = CheeseController.createResponse({"ERROR": "No cookies"}, 401)
            CheeseController.sendResponse(server, response)
            return

        user = UserRepository.findUserByCredentials(userName, password)
        if (user == None):
            response = CheeseController.createResponse({"ERROR": "Wrong credentials"}, 401)
            CheeseController.sendResponse(server, response)
            return

        token = AuthenticationController.getToken(server, user.id)

        response = CheeseController.createResponse({"USER": user.toJson(), "TOKEN": token.token}, 200)
        CheeseController.sendResponse(server, response)

    #METHODS

    @staticmethod
    def getToken(server, userId):
        token = TokenRepository.findTokenByUserIdAndIp(userId, CheeseController.getClientAddress(server))
        if (token == None):
            token = Token()
            token.id = TokenRepository.findNewId()
            token.user_id = userId
            token.token = AuthenticationController.generateToken()
            while (TokenRepository.validateToken(token.token)):
                token.token = AuthenticationController.generateToken()
            token.ip = CheeseController.getClientAddress(server)
            TokenRepository.save(token)
        return token

    @staticmethod
    def generateToken(size=12, chars=string.ascii_uppercase + string.digits):
       return ''.join(random.choice(chars) for _ in range(size))

