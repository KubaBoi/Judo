#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository rooms;
#@dbscheme (id, bed, price, hotel_id, available);
#@dbmodel Rooms;
class RoomsRepository(CheeseRepository):

	#@query "select * from rooms where hotel_id=:hotelId and bed=:bedCount;";
	#@return array;
	@staticmethod
	def findByHotelAndBeds(hotelId, bedCount):
		return CheeseRepository.query(hotelId=hotelId, bedCount=bedCount)

	#GENERATED METHODS

	#@query "select * from rooms;";
	#@return array;
	@staticmethod
	def findAll():
		return CheeseRepository.query()

	#@query "select * from rooms where id=:id;";
	#@return one;
	@staticmethod
	def find(id):
		return CheeseRepository.query(id=id)

	#@query "select * from rooms where :columnName=:value;";
	#@return array;
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.query(columnName=columnName, value=value)

