#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.resourceManager import ResMan
from cheese.modules.cheeseController import CheeseController
from cheese.ErrorCodes import Error

from python.repositories.hotelRepository import HotelRepository
from python.repositories.roomRepository import RoomRepository

from python.models.Hotel import Hotel
from python.models.Room import Room 

#@controller /hotels
class HotelController(CheeseController):

    #@get /getHotels
    @staticmethod
    def getHotels(server, path, auth):
        args = CheeseController.getArgs(path)

        if (not CheeseController.validateJson(["title", "city", "oneBed", "twoBed", "threeBed", "fourBed"],args)):
            CheeseController.sendResponse(server, Error.BadJson)
            return

        title = args["title"]
        city = args["city"]
        oneBed = args["oneBed"]
        twoBed = args["twoBed"]
        threeBed = args["threeBed"]
        fourBed = args["fourBed"]

        bedFilt = "("
        bedFilt = HotelController.__prepareBedFilter(oneBed, 1, bedFilt)
        bedFilt = HotelController.__prepareBedFilter(twoBed, 2, bedFilt)
        bedFilt = HotelController.__prepareBedFilter(threeBed, 3, bedFilt)
        bedFilt = HotelController.__prepareBedFilter(fourBed, 4, bedFilt)
        bedFilt += ")"
        if (bedFilt == "()"): bedFilt = "(r.hotel_id = h.id)"

        filt = f"h.title LIKE '%{title}%' and "
        filt += f"h.city LIKE '%{city}%'"

        if ((title != "" and city != "") or
         oneBed != "true" or
         twoBed != "true" or
         threeBed != "true" or
         fourBed != "true"):
            filt += " and (r.count > 0)"

        hotels = HotelRepository.findAllHotelsBy(bedFilt, filt)

        response = CheeseController.createResponse({"HOTELS": CheeseController.modulesToJsonArray(hotels)}, 200)
        CheeseController.sendResponse(server, response)

    #@get /getRooms
    @staticmethod
    def getRooms(server, path, auth):
        args = CheeseController.getArgs(path)

        if (not CheeseController.validateJson(["hotelId"], args)):
            CheeseController.sendResponse(server, Error.BadJson)
            return

        hotelId = int(args["hotelId"])

        hotel = HotelRepository.findHotelById(hotelId)

        if (hotel == None):
            Error.sendCustomError(server, f"Hotel with id {hotelId} does not exist.", 404)
            return

        rooms = RoomRepository.findRoomsByHotelId(hotel.id)
        hotel.rooms = rooms

        response = CheeseController.createResponse({"HOTEL": hotel.toJson()}, 200)
        CheeseController.sendResponse(server, response)

    #@post /updateHotel
    @staticmethod
    def updateHotel(server, path, auth):
        args = CheeseController.readArgs(server)

        if (not CheeseController.validateJson(["HOTEL"], args)):
            CheeseController.sendResponse(server, Error.BadJson)
            return
        
        hotel = args["HOTEL"]
        if (not CheeseController.validateJson(["ID", "TITLE", "STREET", "CITY", "ZIP", "EMAIL", "PHONE", "WEB", "ROOMS"], hotel)):
            CheeseController.sendResponse(server, Error.BadJson)
            return

        rooms = hotel["ROOMS"]
        for room in rooms:
            if (not CheeseController.validateJson(["ID", "BED", "HOTEL_ID", "COUNT", "PRICE_RO", "PRICE_BB", "PRICE_HB", "PRICE_FB"], room)):
                CheeseController.sendResponse(server, Error.BadJson)
                return

        modelHotel = Hotel()
        modelHotel.toModel(hotel)

        HotelRepository.update(modelHotel)
        for room in modelHotel.rooms:
            RoomRepository.update(room)

        response = CheeseController.createResponse({"STATUS": "OK"}, 200)
        CheeseController.sendResponse(server, response)

    #@post /createHotel
    @staticmethod
    def createHotel(server, path, auth):
        args = CheeseController.readArgs(server)

        if (not CheeseController.validateJson(["HOTEL", "HARD_CREATE"], args)):
            CheeseController.sendResponse(server, Error.BadJson)
            return
        
        hotel = args["HOTEL"]
        if (not CheeseController.validateJson(["TITLE", "STREET", "CITY", "ZIP", "EMAIL", "PHONE", "WEB", "ROOMS"], hotel)):
            CheeseController.sendResponse(server, Error.BadJson)
            return

        rooms = hotel["ROOMS"]
        for room in rooms:
            if (not CheeseController.validateJson(["BED", "COUNT", "PRICE_RO", "PRICE_BB", "PRICE_HB", "PRICE_FB"], room)):
                CheeseController.sendResponse(server, Error.BadJson)
                return
        
        if (HotelRepository.doesHotelExists(hotel["TITLE"]) and args["HARD_CREATE"] == "false"):
            response = CheeseController.createResponse({"STATUS": "Already exists"}, 200)
            CheeseController.sendResponse(server, response)
            return 

        hotel["ID"] = HotelRepository.findNewId()
        for i, room in enumerate(hotel["ROOMS"]):
            room["ID"] = RoomRepository.findNewId() + i
            room["HOTEL_ID"] = hotel["ID"]
        
        modelHotel = Hotel()
        modelHotel.toModel(hotel)

        HotelRepository.save(modelHotel)
        for room in modelHotel.rooms:
            RoomRepository.save(room)

        response = CheeseController.createResponse({"STATUS": "OK"}, 200)
        CheeseController.sendResponse(server, response)

    #@get /deleteHotel
    @staticmethod
    def deleteHotel(server, path, auth):
        args = CheeseController.getArgs(path)

        if (not CheeseController.validateJson(["hotelId"], args)):
            CheeseController.sendResponse(server, Error.BadJson)
            return

        hotelId = args["hotelId"]

        hotel = HotelRepository.findHotelById(hotelId)
        if (hotel == None):
            Error.sendCustomError(server, f"Hotel with id {hotelId} does not exist.", 404)
            return

        rooms = RoomRepository.findRoomsByHotelId(hotel.id)
        for room in rooms:
            RoomRepository.delete(room)

        HotelRepository.delete(hotel)
        response = CheeseController.createResponse({"STATUS": "OK"}, 200)
        CheeseController.sendResponse(server, response)

    #METHODS

    @staticmethod
    def __prepareBedFilter(value, count, bedFilt):
        if (value == "true"): 
            if (bedFilt != "("):
                return f"{bedFilt} or r.bed = {count}"
            else:
                return f"{bedFilt}r.bed = {count}"
        else: return bedFilt
