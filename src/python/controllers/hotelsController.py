#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.ErrorCodes import Error
from cheese.modules.cheeseController import CheeseController as cc

from python.repositories.hotelsRepository import HotelsRepository
from python.repositories.roomsRepository import RoomsRepository
from python.repositories.bedRepository import BedRepository

from python.models.hotels import Hotels
from python.models.rooms import Rooms
from python.models.bed import Bed

#@controller /hotels
class HotelsController(cc):

	#@post /create
	@staticmethod
	def create(server, path, auth):
		if (auth["role"] > 1):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['NAME', 'ADDRESS', 'MAIL', 'WEB', 'PHONE', 'PACKAGE', 'P_NIGHTS', 'ONE_ROOM', 'ONE_ROOM_PRICE', 'TWO_ROOM', 'TWO_ROOM_PRICE', 'THREE_ROOM', 'THREE_ROOM_PRICE', 'APARTMAN_ROOM', 'APARTMAN_ROOM_PRICE'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		name = args["NAME"]
		address = args["ADDRESS"]
		mail = args["MAIL"]
		web = args["WEB"]
		phone = args["PHONE"]
		package = args["PACKAGE"]
		pNights = args["P_NIGHTS"]
		oneRoom = args["ONE_ROOM"]
		oneRoomPrice = args["ONE_ROOM_PRICE"]
		twoRoom = args["TWO_ROOM"]
		twoRoomPrice = args["TWO_ROOM_PRICE"]
		threeRoom = args["THREE_ROOM"]
		threeRoomPrice = args["THREE_ROOM_PRICE"]
		apartmanRoom = args["APARTMAN_ROOM"]
		apartmanRoomPrice = args["APARTMAN_ROOM_PRICE"]

		newId = HotelsRepository.findNewId()
		hotelsModel = Hotels()
		hotelsModel.id = newId
		hotelsModel.name = name
		hotelsModel.address = address
		hotelsModel.mail = mail
		hotelsModel.web = web
		hotelsModel.phone = phone
		hotelsModel.package = package
		hotelsModel.p_nights = pNights

		HotelsController.createRooms(1, oneRoom, newId, oneRoomPrice)
		HotelsController.createRooms(2, twoRoom, newId, twoRoomPrice)
		HotelsController.createRooms(3, threeRoom, newId, threeRoomPrice)
		HotelsController.createRooms(4, apartmanRoom, newId, apartmanRoomPrice)

		HotelsRepository.save(hotelsModel)

		response = cc.createResponse({"ID": newId}, 200)
		cc.sendResponse(server, response)

	#@post /update
	@staticmethod
	def update(server, path, auth):
		if (auth["role"] > 1):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['ID', 'NAME', 'ADDRESS', 'MAIL', 'WEB', 'PHONE', 'PACKAGE', 'P_NIGHTS', 'ONE_ROOM', 'ONE_ROOM_PRICE', 'TWO_ROOM', 'TWO_ROOM_PRICE', 'THREE_ROOM', 'THREE_ROOM_PRICE', 'APARTMAN_ROOM', 'APARTMAN_ROOM_PRICE'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["ID"]
		name = args["NAME"]
		address = args["ADDRESS"]
		mail = args["MAIL"]
		web = args["WEB"]
		phone = args["PHONE"]
		package = args["PACKAGE"]
		pNights = args["P_NIGHTS"]
		oneRoom = args["ONE_ROOM"]
		oneRoomPrice = args["ONE_ROOM_PRICE"]
		twoRoom = args["TWO_ROOM"]
		twoRoomPrice = args["TWO_ROOM_PRICE"]
		threeRoom = args["THREE_ROOM"]
		threeRoomPrice = args["THREE_ROOM_PRICE"]
		apartmanRoom = args["APARTMAN_ROOM"]
		apartmanRoomPrice = args["APARTMAN_ROOM_PRICE"]

		hotelsModel = HotelsRepository.findById(id)
		hotelsModel.id = id
		hotelsModel.name = name
		hotelsModel.address = address
		hotelsModel.mail = mail
		hotelsModel.web = web
		hotelsModel.phone = phone
		hotelsModel.package = package
		hotelsModel.p_nights = pNights
		HotelsRepository.update(hotelsModel)

		response = cc.createResponse({'STATUS': 'Hotel has been updated'}, 200)
		cc.sendResponse(server, response)

	#@get /getAll
	@staticmethod
	def getAll(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		hotelsArray = HotelsRepository.findAll()
		jsonResponse = {}
		jsonResponse["HOTELS"] = []
		for hotel in hotelsArray:
			jsonResponse["HOTELS"].append(hotel.toJson())

		response = cc.createResponse(jsonResponse, 200)
		cc.sendResponse(server, response)

	#@post /getByName
	@staticmethod
	def getByName(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['NAME'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		name = args["NAME"]

		hotelsArray = HotelsRepository.findBy("columnName-name", name)
		jsonResponse = {}
		jsonResponse["HOTELS"] = []
		for hotel in hotelsArray:
			jsonResponse["HOTELS"].append(hotel.toJson())

		response = cc.createResponse(jsonResponse, 200)
		cc.sendResponse(server, response)

	#@post /getByPlace
	@staticmethod
	def getByPlace(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['PLACE'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		place = args["PLACE"]

		hotelsArray = HotelsRepository.findBy("columnName-place", place)
		jsonResponse = {}
		jsonResponse["HOTELS"] = []
		for hotel in hotelsArray:
			jsonResponse["HOTELS"].append(hotel.toJson())

		response = cc.createResponse(jsonResponse, 200)
		cc.sendResponse(server, response)

	#@post /getRooms
	@staticmethod
	def getRooms(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['HOTEL_ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		hotelId = args["HOTEL_ID"]
		roomsArray = RoomsRepository.findBy("columnName-hotel_id", hotelId)

		jsonResponse = {}
		jsonResponse["ROOMS"] = []
		for room in roomsArray:
			jsonResponse["ROOMS"].append(room.toJson())

		response = cc.createResponse(jsonResponse, 200)
		cc.sendResponse(server, response)

	#@post /reserveBed
	@staticmethod
	def reserveBed(server, path, auth):
		if (auth["role"] > 2):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['HOTEL_ID', 'ROOM_ID', 'JBS'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		hotelId = args["HOTEL_ID"]
		roomId = args["ROOM_ID"]
		jbs = args["JBS"]

		room = RoomsRepository.find(roomId)

		if (not room.available):
			Error.sendCustomError("Room is already occupied")
			return

		beds = BedRepository.findBy("columnName-room_id", roomId)

		if (len(beds) < len(jbs)):
			Error.sendCustomError(server, "Room does not have such a capacity", 103)
			return

		for bed in beds:
			if (bed.jb_id == -1):
				bed.jb_id = jbs
				BedRepository.update(bed)

		room.available = False
		RoomsRepository.update(room)

		response = cc.createResponse({'STATUS': 'Bed has been reserved'}, 200)
		cc.sendResponse(server, response)

	#@post /remove
	@staticmethod
	def remove(server, path, auth):
		if (auth["role"] > 1):
			Error.sendCustomError(server, "Unauthorized access", 400)
			return

		args = cc.readArgs(server)

		if (not cc.validateJson(['ID'], args)):
			Error.sendCustomError(server, "Wrong json structure", 400)
			return

		id = args["ID"]

		hotelsModel = HotelsRepository.findById(id)
		HotelsRepository.delete(hotelsModel)

		response = cc.createResponse({'STATUS': 'Hotel has been removed'}, 200)
		cc.sendResponse(server, response)




	# METHODS

	@staticmethod
	def createRooms(countOfBeds, countOfRooms, hotelId, price):
		for i in range(countOfRooms):
			newId = RoomsRepository.findNewId()
			newRoom = Rooms()
			newRoom.id = newId
			newRoom.bed = countOfBeds
			newRoom.hotel_id = hotelId
			newRoom.price = price
			newRoom.available = True
			RoomsRepository.save(newRoom)

			for o in range(countOfBeds):
				newBedId = BedRepository.findNewId()
				newBed = Bed()
				newBed.id = newBedId
				newBed.jb_id = -1
				newBed.room_id = newId
				BedRepository.save(newBed)

