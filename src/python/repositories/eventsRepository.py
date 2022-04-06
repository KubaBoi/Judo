#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository events
#@dbscheme (id, show_hotel, pcr_price, ag_price, trans_price, other_price, start, end, arrive, depart, end_visa, end_room, organiser_id, eju_price, name, category, place, visa_phone, visa_mail)
#@dbmodel Events
class Eventsrepository(CheeseRepository):



	#@query "select max(id) from events";
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

