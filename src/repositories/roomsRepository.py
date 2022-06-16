#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository rooms;
#@dbscheme (id, bed, price, bb, hb, fb, liv, hotel_id, available);
#@dbmodel Rooms;
class RoomsRepository(CheeseRepository):

	#@query "select * from rooms where hotel_id=:hotelId and bed=:bedCount;";
	#@return array;
	@staticmethod
	def findByHotelAndBeds(hotelId, bedCount):
		return CheeseRepository.query(hotelId=hotelId, bedCount=bedCount)

	#@query "select * from rooms where hotel_id=:hotelId and available=true;";
	#@return array;
	@staticmethod
	def findAvailableRooms(hotelId):
		return CheeseRepository.query(hotelId=hotelId)

