#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository jb;
#@dbscheme (id, birthday, pass_release, pass_expiration, function, pass_id, gender, jb, name, sur_name, state);
#@dbmodel Jb;
class JbRepository(CheeseRepository):
	
	#@query "select * from jb order by state, sur_name, id;";
	#@return array;
	@staticmethod
	def findAllOrderByState():
		return CheeseRepository.query()

