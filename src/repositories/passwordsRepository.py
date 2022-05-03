#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository passwords;
#@dbscheme (id, password, login);
#@dbmodel Passwords;
class PasswordsRepository(CheeseRepository):

	#@query "select case when exists
	#       (select * from passwords p 
	# 		where p.login = :login and
	# 		p.password = :password)
	#       then cast(1 as bit)
	#       else cast(0 as bit) end;";
	#@return bool;
	@staticmethod
	def login(login, password):
		return CheeseRepository.query(login=login, password=password)

	#GENERATED METHODS

	#@query "select * from passwords;";
	#@return array;
	@staticmethod
	def findAll():
		return CheeseRepository.query()

	#@query "select * from passwords where id=:id;";
	#@return one;
	@staticmethod
	def find(id):
		return CheeseRepository.query(id=id)

	#@query "select * from passwords where :columnName=:value;";
	#@return array;
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.query(columnName=columnName, value=value)

