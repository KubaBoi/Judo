#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository hotels
#@dbscheme (id, package, p_nights, mail, web, phone, name, address)
#@dbmodel Hotels
class Hotelsrepository(CheeseRepository):



	#@query "select max(id) from hotels";
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

