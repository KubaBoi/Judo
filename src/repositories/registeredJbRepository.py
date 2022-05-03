#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository registered_jb;
#@dbscheme (id, reg_club_id, jb_id, arrive, departure, transport, flight_number);
#@dbmodel RegisteredJb;
class RegisteredJbRepository(CheeseRepository):



	#GENERATED METHODS

	#@query "select * from registered_jb;";
	#@return array;
	@staticmethod
	def findAll():
		return CheeseRepository.query()

	#@query "select * from registered_jb where id=:id;";
	#@return one;
	@staticmethod
	def find(id):
		return CheeseRepository.query(id=id)

	#@query "select * from registered_jb where :columnName=:value;";
	#@return array;
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.query(columnName=columnName, value=value)

