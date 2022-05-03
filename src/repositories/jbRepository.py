#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository jb;
#@dbscheme (id, club_id, birthday, pass_release, pass_expiration, function, pass_id, gender, jb, name, sur_name);
#@dbmodel Jb;
class JbRepository(CheeseRepository):



	#GENERATED METHODS

	#@query "select * from jb;";
	#@return array;
	@staticmethod
	def findAll():
		return CheeseRepository.query()

	#@query "select * from jb where id=:id;";
	#@return one;
	@staticmethod
	def find(id):
		return CheeseRepository.query(id=id)

	#@query "select * from jb where :columnName=:value;";
	#@return array;
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.query(columnName=columnName, value=value)

