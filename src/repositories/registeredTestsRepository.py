#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository registered_tests;
#@dbscheme (id, reg_jb_id, pcr, date);
#@dbmodel RegisteredTests;
class RegisteredTestsRepository(CheeseRepository):



	#GENERATED METHODS

	#@query "select * from registered_tests;";
	#@return array;
	@staticmethod
	def findAll():
		return CheeseRepository.query()

	#@query "select * from registered_tests where id=:id;";
	#@return one;
	@staticmethod
	def find(id):
		return CheeseRepository.query(id=id)

	#@query "select * from registered_tests where :columnName=:value;";
	#@return array;
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.query(columnName=columnName, value=value)

