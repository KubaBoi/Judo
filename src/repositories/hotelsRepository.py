#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository hotels;
#@dbscheme (id, package, p_nights, mail, web, phone, name, address);
#@dbmodel Hotels;
class HotelsRepository(CheeseRepository):

	#@query "select * from hotels order by :columnName ASC;";
	#@return array;
	@staticmethod
	def findBySorted(columnName):
		return CheeseRepository.query([columnName])

