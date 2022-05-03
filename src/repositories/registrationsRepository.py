#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository registrations;
#@dbscheme (id, login, password, phone, full_name, registration_code);
#@dbmodel Registrations;
class RegistrationsRepository(CheeseRepository):



	#GENERATED METHODS

	#@query "select * from registrations;";
	#@return array;
	@staticmethod
	def findAll():
		return CheeseRepository.query()

	#@query "select * from registrations where id=:id;";
	#@return one;
	@staticmethod
	def find(id):
		return CheeseRepository.query(id=id)

	#@query "select * from registrations where :columnName=:value;";
	#@return one;
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.query(columnName=columnName, value=value)


