#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository registered_hotels;
#@dbscheme (id, event_id, hotel_id);
#@dbmodel RegisteredHotels;
class RegisteredHotelsRepository(CheeseRepository):



	#GENERATED METHODS

	#@query "select * from registered_hotels;";
	#@return array;
	@staticmethod
	def findAll():
		return CheeseRepository.query()

	#@query "select * from registered_hotels where id=:id;";
	#@return one;
	@staticmethod
	def find(id):
		return CheeseRepository.query(id=id)

	#@query "select * from registered_hotels where :columnName=:value;";
	#@return array;
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.query(columnName=columnName, value=value)

