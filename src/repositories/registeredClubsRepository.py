#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository registered_clubs;
#@dbscheme (id, event_id, club_id, visa, checked);
#@dbmodel RegisteredClubs;
class RegisteredClubsRepository(CheeseRepository):



	#GENERATED METHODS

	#@query "select * from registered_clubs;";
	#@return array;
	@staticmethod
	def findAll():
		return CheeseRepository.query()

	#@query "select * from registered_clubs where id=:id;";
	#@return one;
	@staticmethod
	def find(id):
		return CheeseRepository.query(id=id)

	#@query "select * from registered_clubs where :columnName=:value;";
	#@return array;
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.query(columnName=columnName, value=value)

