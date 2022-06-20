#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc

from src.repositories.hotelsRepository import HotelsRepository
from src.repositories.roomsRepository import RoomsRepository
from src.repositories.bedRepository import BedRepository

#@controller /hotels;
class HotelsController(cc):

	#@post /create;
	@staticmethod
	def create(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['HARD_CREATE', 'NAME', 'ADDRESS', 'MAIL', 'WEB', 'PHONE', 'PACKAGE', 'P_NIGHTS', 'ONE_ROOM', 'ONE_ROOM_PRICE', 'TWO_ROOM', 'TWO_ROOM_PRICE', 'THREE_ROOM', 'THREE_ROOM_PRICE', 'APARTMAN_ROOM', 'APARTMAN_ROOM_PRICE'], args)):
			raise BadRequest("Wrong json structure")

		name = args["NAME"]
		address = args["ADDRESS"]
		mail = args["MAIL"]
		web = args["WEB"]
		phone = args["PHONE"]
		package = args["PACKAGE"]
		pNights = args["P_NIGHTS"]
		oneRoom = args["ONE_ROOM"]
		oneRoomPrice = args["ONE_ROOM_PRICE"]
		oneRoomBB = args["ONE_ROOM_BB"]
		oneRoomHB = args["ONE_ROOM_HB"]
		oneRoomFB = args["ONE_ROOM_FB"]
		oneRoomLIV = args["ONE_ROOM_LIV"]
		twoRoom = args["TWO_ROOM"]
		twoRoomPrice = args["TWO_ROOM_PRICE"]
		twoRoomBB = args["TWO_ROOM_BB"]
		twoRoomHB = args["TWO_ROOM_HB"]
		twoRoomFB = args["TWO_ROOM_FB"]
		twoRoomLIV = args["TWO_ROOM_LIV"]
		threeRoom = args["THREE_ROOM"]
		threeRoomPrice = args["THREE_ROOM_PRICE"]
		threeRoomBB = args["THREE_ROOM_BB"]
		threeRoomHB = args["THREE_ROOM_HB"]
		threeRoomFB = args["THREE_ROOM_FB"]
		threeRoomLIV = args["THREE_ROOM_LIV"]
		apartmanRoom = args["APARTMAN_ROOM"]
		apartmanRoomPrice = args["APARTMAN_ROOM_PRICE"]
		apartmanRoomBB = args["APARTMAN_ROOM_BB"]
		apartmanRoomHB = args["APARTMAN_ROOM_HB"]
		apartmanRoomFB = args["APARTMAN_ROOM_FB"]
		apartmanRoomLIV = args["APARTMAN_ROOM_LIV"]

		if (not args["HARD_CREATE"]):
			existingHotel = HotelsRepository.findBy("name", name)
			if (existingHotel == None):
				return
			if (len(existingHotel) > 0):
				raise Conflict("Hotel already exists")

		hotelsModel = HotelsRepository.model()
		hotelsModel.name = name
		hotelsModel.address = address
		hotelsModel.mail = mail
		hotelsModel.web = web
		hotelsModel.phone = phone
		hotelsModel.package = package
		hotelsModel.p_nights = pNights

		HotelsController.createRooms(1, oneRoom, hotelsModel.id, oneRoomPrice, oneRoomBB, oneRoomHB, oneRoomFB, oneRoomLIV)
		HotelsController.createRooms(2, twoRoom, hotelsModel.id, twoRoomPrice, twoRoomBB, twoRoomHB, twoRoomFB, twoRoomLIV)
		HotelsController.createRooms(3, threeRoom, hotelsModel.id, threeRoomPrice, threeRoomBB, threeRoomHB, threeRoomFB, threeRoomLIV)
		HotelsController.createRooms(4, apartmanRoom, hotelsModel.id, apartmanRoomPrice, apartmanRoomBB, apartmanRoomHB, apartmanRoomFB, apartmanRoomLIV)

		HotelsRepository.save(hotelsModel)

		return cc.createResponse({"ID": hotelsModel.id}, 200)
		

	#@post /update;
	@staticmethod
	def update(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['ID', 'NAME', 'ADDRESS', 'MAIL', 'WEB', 'PHONE', 'PACKAGE', 'P_NIGHTS', 'ONE_ROOM', 'ONE_ROOM_PRICE', 'TWO_ROOM', 'TWO_ROOM_PRICE', 'THREE_ROOM', 'THREE_ROOM_PRICE', 'APARTMAN_ROOM', 'APARTMAN_ROOM_PRICE'], args)):
			raise BadRequest("Wrong json structure")

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
		oneRoomBB = args["ONE_ROOM_BB"]
		oneRoomHB = args["ONE_ROOM_HB"]
		oneRoomFB = args["ONE_ROOM_FB"]
		oneRoomLIV = args["ONE_ROOM_LIV"]
		twoRoom = args["TWO_ROOM"]
		twoRoomPrice = args["TWO_ROOM_PRICE"]
		twoRoomBB = args["TWO_ROOM_BB"]
		twoRoomHB = args["TWO_ROOM_HB"]
		twoRoomFB = args["TWO_ROOM_FB"]
		twoRoomLIV = args["TWO_ROOM_LIV"]
		threeRoom = args["THREE_ROOM"]
		threeRoomPrice = args["THREE_ROOM_PRICE"]
		threeRoomBB = args["THREE_ROOM_BB"]
		threeRoomHB = args["THREE_ROOM_HB"]
		threeRoomFB = args["THREE_ROOM_FB"]
		threeRoomLIV = args["THREE_ROOM_LIV"]
		apartmanRoom = args["APARTMAN_ROOM"]
		apartmanRoomPrice = args["APARTMAN_ROOM_PRICE"]
		apartmanRoomBB = args["APARTMAN_ROOM_BB"]
		apartmanRoomHB = args["APARTMAN_ROOM_HB"]
		apartmanRoomFB = args["APARTMAN_ROOM_FB"]
		apartmanRoomLIV = args["APARTMAN_ROOM_LIV"]

		hotelsModel = HotelsRepository.find(id)
		hotelsModel.name = name
		hotelsModel.address = address
		hotelsModel.mail = mail
		hotelsModel.web = web
		hotelsModel.phone = phone
		hotelsModel.package = package
		hotelsModel.p_nights = pNights
		HotelsRepository.update(hotelsModel)

		oneRooms = RoomsRepository.findByHotelAndBeds(id, 1)
		twoRooms = RoomsRepository.findByHotelAndBeds(id, 2)
		threeRooms = RoomsRepository.findByHotelAndBeds(id, 3)
		apartmanRooms = RoomsRepository.findByHotelAndBeds(id, 4)

		HotelsController.updateRoom(oneRooms, oneRoom, 1, id, oneRoomPrice, oneRoomBB, oneRoomHB, oneRoomFB, oneRoomLIV)
		HotelsController.updateRoom(twoRooms, twoRoom, 2, id, twoRoomPrice, twoRoomBB, twoRoomHB, twoRoomFB, twoRoomLIV)
		HotelsController.updateRoom(threeRooms, threeRoom, 3, id, threeRoomPrice, threeRoomBB, threeRoomHB, threeRoomFB, threeRoomLIV)
		HotelsController.updateRoom(apartmanRooms, apartmanRoom, 4, id, apartmanRoomPrice, apartmanRoomBB, apartmanRoomHB, apartmanRoomFB, apartmanRoomLIV)

		return cc.createResponse({'STATUS': 'Hotel has been updated'}, 200)
		

	#@get /getAll;
	@staticmethod
	def getAll(server, path, auth):
		hotelsArray = HotelsRepository.findAll()
		jsonResponse = {}
		jsonResponse["HOTELS"] = []
		for hotel in hotelsArray:
			jsonResponse["HOTELS"].append(hotel.toJson())

		return cc.createResponse(jsonResponse, 200)
		

	#@get /get;
	@staticmethod
	def get(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(["hotelId"], args)):
			raise BadRequest("Wrong json structure")

		id = args["hotelId"]

		hotel = HotelsRepository.find(id)
		if (hotel == None):
			raise NotFound("Hotel was not found")

		jsonResponse = hotel.toJson()

		oneRooms = RoomsRepository.findByHotelAndBeds(id, 1)
		twoRooms = RoomsRepository.findByHotelAndBeds(id, 2)
		threeRooms = RoomsRepository.findByHotelAndBeds(id, 3)
		apartmanRooms = RoomsRepository.findByHotelAndBeds(id, 4)

		jsonResponse["ONE_ROOM"] = len(oneRooms)
		jsonResponse["ONE_ROOM_PRICE"] = 0 if (len(oneRooms) <= 0) else oneRooms[0].price
		jsonResponse["ONE_ROOM_BB"] = 0 if (len(oneRooms) <= 0) else oneRooms[0].bb
		jsonResponse["ONE_ROOM_HB"] = 0 if (len(oneRooms) <= 0) else oneRooms[0].hb
		jsonResponse["ONE_ROOM_FB"] = 0 if (len(oneRooms) <= 0) else oneRooms[0].fb
		jsonResponse["ONE_ROOM_LIV"] = 0 if (len(oneRooms) <= 0) else oneRooms[0].liv
		jsonResponse["TWO_ROOM"] = len(twoRooms)
		jsonResponse["TWO_ROOM_PRICE"] = 0 if (len(twoRooms) <= 0) else twoRooms[0].price
		jsonResponse["TWO_ROOM_BB"] = 0 if (len(twoRooms) <= 0) else twoRooms[0].bb
		jsonResponse["TWO_ROOM_HB"] = 0 if (len(twoRooms) <= 0) else twoRooms[0].hb
		jsonResponse["TWO_ROOM_FB"] = 0 if (len(twoRooms) <= 0) else twoRooms[0].fb
		jsonResponse["TWO_ROOM_LIV"] = 0 if (len(twoRooms) <= 0) else twoRooms[0].liv
		jsonResponse["THREE_ROOM"] = len(threeRooms)
		jsonResponse["THREE_ROOM_PRICE"] = 0 if (len(threeRooms) <= 0) else threeRooms[0].price
		jsonResponse["THREE_ROOM_BB"] = 0 if (len(threeRooms) <= 0) else threeRooms[0].bb
		jsonResponse["THREE_ROOM_HB"] = 0 if (len(threeRooms) <= 0) else threeRooms[0].hb
		jsonResponse["THREE_ROOM_FB"] = 0 if (len(threeRooms) <= 0) else threeRooms[0].fb
		jsonResponse["THREE_ROOM_LIV"] = 0 if (len(threeRooms) <= 0) else threeRooms[0].liv
		jsonResponse["APARTMAN_ROOM"] = len(apartmanRooms)
		jsonResponse["APARTMAN_ROOM_PRICE"] = 0 if (len(apartmanRooms) <= 0) else apartmanRooms[0].price
		jsonResponse["APARTMAN_ROOM_BB"] = 0 if (len(apartmanRooms) <= 0) else apartmanRooms[0].bb
		jsonResponse["APARTMAN_ROOM_HB"] = 0 if (len(apartmanRooms) <= 0) else apartmanRooms[0].hb
		jsonResponse["APARTMAN_ROOM_FB"] = 0 if (len(apartmanRooms) <= 0) else apartmanRooms[0].fb
		jsonResponse["APARTMAN_ROOM_LIV"] = 0 if (len(apartmanRooms) <= 0) else apartmanRooms[0].liv

		return cc.createResponse({"HOTEL": jsonResponse}, 200)
		

	#@get /getBy;
	@staticmethod
	def getBy(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(["column"], args)):
			raise BadRequest("Wrong json structure")

		column = args["column"]

		hotelsArray = HotelsRepository.findBySorted(column)
		jsonResponse = {}
		jsonResponse["HOTELS"] = []
		for hotel in hotelsArray:
			jsonResponse["HOTELS"].append(hotel.toJson())

		return cc.createResponse(jsonResponse, 200)
		

	#@get /getRooms;
	@staticmethod
	def getRooms(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['hotelId'], args)):
			raise BadRequest("Wrong json structure")

		hotelId = args["hotelId"]
		roomsArray = RoomsRepository.findBy("hotel_id", hotelId)

		jsonResponse = {}
		jsonResponse["ROOMS"] = []
		for room in roomsArray:
			room.beds = BedRepository.findBy("room_id", room.id)
			jsonResponse["ROOMS"].append(room.toJson())

		return cc.createResponse(jsonResponse, 200)

	#@get /getAvailableRooms;
	@staticmethod
	def getAvailableRooms(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['hotelId'], args)):
			raise BadRequest("Wrong json structure")

		hotelId = args["hotelId"]
		roomsArray = RoomsRepository.findAvailableRooms(hotelId)

		jsonResponse = {}
		jsonResponse["ROOMS"] = []
		for room in roomsArray:
			room.beds = BedRepository.findBy("room_id", room.id)
			jsonResponse["ROOMS"].append(room.toJson())

		return cc.createResponse(jsonResponse, 200)
		

	#@post /reserveBed;
	@staticmethod
	def reserveBed(server, path, auth):
		args = cc.readArgs(server)

		if (not cc.validateJson(['HOTEL_ID', 'ROOM_ID', 'JBS'], args)):
			raise BadRequest("Wrong json structure")

		hotelId = args["HOTEL_ID"]
		roomId = args["ROOM_ID"]
		jbs = args["JBS"]

		room = RoomsRepository.find(roomId)

		if (not room.available):
			raise Conflict("Room is already occupied")

		beds = BedRepository.findBy("room_id", roomId)

		if (len(beds) < len(jbs)):
			raise Forbidden("Room does not have such a capacity")

		for bed in beds:
			if (bed.jb_id == -1):
				bed.jb_id = jbs
				BedRepository.update(bed)

		room.available = False
		RoomsRepository.update(room)

		return cc.createResponse({'STATUS': 'Bed has been reserved'}, 200)
		

	#@get /remove;
	@staticmethod
	def remove(server, path, auth):
		args = cc.getArgs(path)

		if (not cc.validateJson(['id'], args)):
			raise BadRequest("Wrong json structure")

		id = args["id"]

		rooms = RoomsRepository.findBy("hotel_id", id)
		for room in rooms:
			beds = BedRepository.findBy("room_id", room.id)
			for bed in beds:
				BedRepository.delete(bed)
			RoomsRepository.delete(room)

		hotelsModel = HotelsRepository.find(id)
		HotelsRepository.delete(hotelsModel)

		return cc.createResponse({'STATUS': 'Hotel has been removed'}, 200)
		




	# METHODS

	@staticmethod
	def createRooms(countOfBeds, countOfRooms, hotelId, price, bb, hb, fb, liv):
		for i in range(countOfRooms):
			newRoom = RoomsRepository.model()
			newRoom.bed = countOfBeds
			newRoom.hotel_id = hotelId
			newRoom.price = price
			newRoom.bb = bb
			newRoom.hb = hb
			newRoom.fb = fb
			newRoom.liv = liv
			newRoom.available = True
			RoomsRepository.save(newRoom)

			for o in range(countOfBeds):
				newBed = BedRepository.model()
				newBed.jb_id = -1
				newBed.room_id = newRoom.id
				BedRepository.save(newBed)

	@staticmethod
	def updateRoom(rooms, roomCount, bed, hotelId, roomPrice, bb, hb, fb, liv):
		if (len(rooms) > roomCount):
			more = len(rooms) - roomCount
			for i in range(more):
				beds = BedRepository.findBy("room_id", rooms[0].id)
				for bed in beds:
					BedRepository.delete(bed)
				RoomsRepository.delete(rooms[0])
				rooms.remove(rooms[0])

		elif (len(rooms) < roomCount):
			less = roomCount - len(rooms)
			HotelsController.createRooms(bed, less, hotelId, roomPrice, bb, hb, fb, liv)

		for room in rooms:
			room.price = roomPrice
			room.bb = bb
			room.hb = hb
			room.fb = fb
			room.liv = liv
			RoomsRepository.update(room)

