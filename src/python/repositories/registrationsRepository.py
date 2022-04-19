#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository registrations
#@dbscheme (id, login, password, phone, full_name, registration_code)
#@dbmodel Registrations
class RegistrationsRepository(CheeseRepository):



	#GENERATED METHODS

	#@query "select * from registrations;"
	#@return array
	@staticmethod
	def findAll():
		return CheeseRepository.findAll([])

	#@query "select * from registrations where id=:id;"
	#@return one
	@staticmethod
	def find(id):
		return CheeseRepository.find([id])

	#@query "select * from registrations where :columnName=:value;"
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

