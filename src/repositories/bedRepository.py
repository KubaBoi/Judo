#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository bed;
#@dbscheme (id, room_id, jb_id);
#@dbmodel Bed;
class BedRepository(CheeseRepository):



	#GENERATED METHODS

	#@query "select * from bed;";
	#@return array;
	@staticmethod
	def findAll():
		return CheeseRepository.query()

	#@query "select * from bed where id=:id;";
	#@return one;
	@staticmethod
	def find(id):
		return CheeseRepository.query(id=id)

	#@query "select * from bed where :columnName=:value;";
	#@return array;
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.query(columnName=columnName, value=value)

