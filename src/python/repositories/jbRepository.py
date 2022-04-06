#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository jb
#@dbscheme (id, club_id, birthday, pass_release, pass_expiration, function, pass_id, gender, jb, name, sur_name)
#@dbmodel Jb
class Jbrepository(CheeseRepository):



	#@query "select max(id) from jb";
	#@return num
	#@staticmethod
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

