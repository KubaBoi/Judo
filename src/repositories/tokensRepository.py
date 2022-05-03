#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository tokens;
#@dbscheme (id, user_id, token, ip);
#@dbmodel Tokens;
class TokensRepository(CheeseRepository):

	#@query "select * from tokens where 
	# 		user_id = :userId and
	# 		ip = :userIp;";
	#@return one;
	@staticmethod
	def findToken(userId, userIp):
		return CheeseRepository.query(userId=userId, userIp=userIp)

	#GENERATED METHODS

	#@query "select * from tokens;";
	#@return array;
	@staticmethod
	def findAll():
		return CheeseRepository.query()

	#@query "select * from tokens where id=:id;";
	#@return one;
	@staticmethod
	def find(id):
		return CheeseRepository.query(id=id)

	#@query "select * from tokens where :columnName=:value;";
	#@return array;
	@staticmethod
	def findBy(columnName, value):
		return CheeseRepository.query(columnName=columnName, value=value)

