#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository clubs;
#@dbscheme (id, eju, user_id, state, name, address);
#@dbmodel Clubs;
class ClubsRepository(CheeseRepository):



	#GENERATED METHODS

	#@query "select * from clubs;";
	#@return array;
	@staticmethod
	def findAll():
		return CheeseRepository.query()

	#@query "select * from clubs where id=:id;";
	#@return one;
	@staticmethod
	def find(id):
		return CheeseRepository.query(id=id)

	#@query "select * from clubs where :columnName=:value;";
	#@return array;
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.query(columnName=columnName, value=value)
