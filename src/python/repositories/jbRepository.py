#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository jb
#@dbscheme (id, club_id, birthday, pass_release, pass_expiration, function, pass_id, gender, jb, name, sur_name)
#@dbmodel Jb
class JbRepository(CheeseRepository):



	#@query "select * from jb;"
	#@return array
	@staticmethod
	def findAll():
		return CheeseRepository.findAll([])

	#@query "select * from jb where id=:id;"
	#@return one
	@staticmethod
	def find(id):
		return CheeseRepository.find([id])

	#@query "select * from jb where :columnName=:value;"
	#@return array
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.findBy([columnName, value])

	#@query "select max(id) from jb;"
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

