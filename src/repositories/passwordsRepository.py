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

