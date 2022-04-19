#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository registered_hotels
#@dbscheme (id, event_id, hotel_id)
#@dbmodel RegisteredHotels
class RegisteredHotelsRepository(CheeseRepository):



	#GENERATED METHODS

	#@query "select * from registered_hotels;"
	#@return array
	@staticmethod
	def findAll():
		return CheeseRepository.findAll([])

	#@query "select * from registered_hotels where id=:id;"
	#@return one
	@staticmethod
	def find(id):
		return CheeseRepository.find([id])

	#@query "select * from registered_hotels where :columnName=:value;"
	#@return array
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.findBy([columnName, value])

	@staticmethod
	def findNewId():
		return CheeseRepository.findNewId([])+1

	@staticmethod
	def save(obj):
		return CheeseRepository.save([obj])

	@staticmethod
	def update(obj):
		return CheeseRepository.update([obj])

	@staticmethod
	def delete(obj):
		return CheeseRepository.delete([obj])

