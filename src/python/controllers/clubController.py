#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.resourceManager import ResMan
from cheese.modules.cheeseController import CheeseController
from cheese.ErrorCodes import Error

from python.repositories.clubRepository import ClubRepository

from python.models.Club import Club

#@controller /clubs
class ClubController(CheeseController):

    #@get /getClubs
    @staticmethod
    def getClubs(server, path, auth):
        args = CheeseController.getArgs(path)

        if (not CheeseController.validateJson(["title", "code", "eju", "city"], args)):
            CheeseController.sendResponse(server, Error.BadJson)
            return

        title = args["title"]
        code = args["code"]
        eju = args["eju"]
        city = args["city"]

        filt = f"title LIKE '%{title}%' and "
        filt += f"code LIKE '%{code}%' and "
        if (eju != ""): filt += f"eju = '{eju}' and "
        filt += f"city LIKE '%{city}%'"

        clubs = ClubRepository.findAllClubsBy(filt)

        response = CheeseController.createResponse({"CLUBS": CheeseController.modulesToJsonArray(clubs)}, 200)
        CheeseController.sendResponse(server, response)

    #@get /getClub
    @staticmethod
    def getClub(server, path, auth):
        args = CheeseController.getArgs(path)

        if (not CheeseController.validateJson(["clubId"], args)):
            CheeseController.sendResponse(server, Error.BadJson)
            return

        clubId = int(args["clubId"])

        club = ClubRepository.findClubById(clubId)

        if (club == None):
            Error.sendCustomError(server, f"Club with id {clubId} does not exist.", 404)
            return

        response = CheeseController.createResponse({"CLUB": club.toJson()}, 200)
        CheeseController.sendResponse(server, response)

    #@post /updateClub
    @staticmethod
    def updateClub(server, path, auth):
        args = CheeseController.readArgs(server)

        if (not CheeseController.validateJson(["CLUB"], args)):
            CheeseController.sendResponse(server, Error.BadJson)
            return
        
        club = args["CLUB"]
        if (not CheeseController.validateJson(["ID", "CODE", "EJU", "TITLE", "STREET", "CITY", "ZIP", "EMAIL", "PHONE", "WEB", "ROOMS"], club)):
            CheeseController.sendResponse(server, Error.BadJson)
            return

        modelClub = Club()
        modelClub.toModel(club)

        ClubRepository.update(modelClub)

        response = CheeseController.createResponse({"STATUS": "OK"}, 200)
        CheeseController.sendResponse(server, response)

    #@post /createClub
    @staticmethod
    def createClub(server, path, auth):
        args = CheeseController.readArgs(server)

        if (not CheeseController.validateJson(["CLUB", "HARD_CREATE"], args)):
            CheeseController.sendResponse(server, Error.BadJson)
            return
        
        club = args["CLUB"]
        if (not CheeseController.validateJson(["TITLE", "CODE", "EJU", "STREET", "CITY", "ZIP", "EMAIL", "PHONE", "WEB", "ROOMS"], club)):
            CheeseController.sendResponse(server, Error.BadJson)
            return
        
        if (ClubRepository.doesClubExists(club["TITLE"]) and args["HARD_CREATE"] == "false"):
            response = CheeseController.createResponse({"STATUS": "Already exists"}, 200)
            CheeseController.sendResponse(server, response)
            return 

        club["ID"] = ClubRepository.findNewId()
        
        modelClub = Club()
        modelClub.toModel(club)

        ClubRepository.save(modelClub)

        response = CheeseController.createResponse({"STATUS": "OK"}, 200)
        CheeseController.sendResponse(server, response)

    #@get /deleteClub
    @staticmethod
    def deleteClub(server, path, auth):
        args = CheeseController.getArgs(path)

        if (not CheeseController.validateJson(["clubId"], args)):
            CheeseController.sendResponse(server, Error.BadJson)
            return

        clubId = args["clubId"]

        club = ClubRepository.findClubById(clubId)
        if (club == None):
            Error.sendCustomError(server, f"Club with id {clubId} does not exist.", 404)
            return

        ClubRepository.delete(club)
        response = CheeseController.createResponse({"STATUS": "OK"}, 200)
        CheeseController.sendResponse(server, response)