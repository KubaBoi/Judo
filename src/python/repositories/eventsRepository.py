#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository events
#@dbscheme (id, show_hotel, pcr_price, ag_price, trans_price, other_price, start, end, arrive, depart, end_visa, end_room, organiser_id, eju_price, name, category, place, visa_phone, visa_mail)
#@dbmodel Events
class EventsRepository(CheeseRepository):



	#@query "select * from events;"
	#@return array
	@staticmethod
	def findAll():
		return CheeseRepository.findAll([])

	#@query "select * from events where id=:id;"
	#@return one
	@staticmethod
	def find(id):
		return CheeseRepository.find([id])

	#@query "select * from events where :columnName=:value;"
	#@return array
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.findBy([columnName, value])

	@staticmethod
	def findNewId(obj):
		return CheeseRepository.findNewId([obj])+1

	@staticmethod
	def save(obj):
		return CheeseRepository.save([obj])

	@staticmethod
	def update(obj):
		return CheeseRepository.update([obj])

	@staticmethod
	def delete(obj):
		return CheeseRepository.delete([obj])

