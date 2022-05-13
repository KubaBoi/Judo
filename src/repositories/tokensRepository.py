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

