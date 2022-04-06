#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository passwords
#@dbscheme (id, password, login)
#@dbmodel Passwords
class PasswordsRepository(CheeseRepository):



	#@query "select * from passwords;"
	#@return array
	@staticmethod
	def findAll():
		return CheeseRepository.findAll([])

	#@query "select * from passwords where id=:id;"
	#@return one
	@staticmethod
	def find(id):
		return CheeseRepository.find([id])

	#@query "select * from passwords where :columnName=:value;"
	#@return array
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.findBy([columnName, value])

	#@query "select max(id) from passwords;"
	#@return num
	@staticmethod
	def findNewId():
		try:
			return CheeseRepository.findNewId([])+1
		except:
			return 0

	@staticmethod
	def save(obj):
		return CheeseRepository.save([obj])

	@staticmethod
	def update(obj):
		return CheeseRepository.update([obj])

	@staticmethod
	def delete(obj):
		return CheeseRepository.delete([obj])

