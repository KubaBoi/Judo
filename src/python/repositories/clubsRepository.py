#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository clubs
#@dbscheme (id, eju, user_id, state, name, address)
#@dbmodel Clubs
class ClubsRepository(CheeseRepository):



	#GENERATED METHODS

	#@query "select * from clubs;"
	#@return array
	@staticmethod
	def findAll():
		return CheeseRepository.findAll([])

	#@query "select * from clubs where id=:id;"
	#@return one
	@staticmethod
	def find(id):
		return CheeseRepository.find([id])

	#@query "select * from clubs where :columnName=:value;"
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

