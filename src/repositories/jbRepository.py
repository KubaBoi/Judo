#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository jb;
#@dbscheme (id, birthday, pass_release, pass_expiration, function, pass_id, gender, jb, name, sur_name, state);
#@dbmodel Jb;
class JbRepository(CheeseRepository):
	
	#@query "select case when exists
	# 		(select * from jb where :filter)
	# 		then cast(1 as bit)
	# 		else cast(0 as bit) end;";
	#@return bool;
	@staticmethod
	def existsAny(filter):
		return CheeseRepository.query(filter=filter)
