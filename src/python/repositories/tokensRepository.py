#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository tokens
#@dbscheme (id, user_id, token, ip)
#@dbmodel Tokens
class TokensRepository(CheeseRepository):



	#@query "select * from tokens;"
	#@return array
	@staticmethod
	def findAll():
		return CheeseRepository.findAll([])

	#@query "select * from tokens where id=:id;"
	#@return one
	@staticmethod
	def find(id):
		return CheeseRepository.find([id])

	#@query "select * from tokens where :columnName=:value;"
	#@return array
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.findBy([columnName, value])

	#@query "select max(id) from tokens;"
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

