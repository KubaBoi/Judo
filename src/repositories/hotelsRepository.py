#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository hotels;
#@dbscheme (id, package, p_nights, mail, web, phone, name, address);
#@dbmodel Hotels;
class HotelsRepository(CheeseRepository):

	#@query "select * from hotels order by :columnName ASC;";
	#@return array;
	@staticmethod
	def findBySorted(columnName):
		return CheeseRepository.query([columnName])


	#GENERATED METHODS

	#@query "select * from hotels;";
	#@return array;
	@staticmethod
	def findAll():
		return CheeseRepository.query()

	#@query "select * from hotels where id=:id;";
	#@return one;
	@staticmethod
	def find(id):
		return CheeseRepository.query(id=id)

	#@query "select * from hotels where :columnName=:value;";
	#@return array;
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.query(columnName=columnName, value=value)

