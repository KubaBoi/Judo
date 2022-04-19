#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository hotels
#@dbscheme (id, package, p_nights, mail, web, phone, name, address)
#@dbmodel Hotels
class HotelsRepository(CheeseRepository):

	#@query "select * from hotels order by :columnName ASC;"
	#@return array
	@staticmethod
	def findBySorted(columnName):
		return CheeseRepository.findBySorted([columnName])


	#GENERATED METHODS

	#@query "select * from hotels;"
	#@return array
	@staticmethod
	def findAll():
		return CheeseRepository.findAll([])

	#@query "select * from hotels where id=:id;"
	#@return one
	@staticmethod
	def find(id):
		return CheeseRepository.find([id])

	#@query "select * from hotels where :columnName=:value;"
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

