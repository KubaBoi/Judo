#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository bed;
#@dbscheme (id, room_id, reg_jb_id);
#@dbmodel Bed;
class BedRepository(CheeseRepository):
	
	#@query "select * from bed where room_id=:roomId;";
	#@return array;
	@staticmethod
	def findByRoomId(roomId):
		return CheeseRepository.query(roomId=roomId)

