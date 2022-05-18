#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository registered_clubs;
#@dbscheme (id, event_id, club_id, visa, status);
#@dbmodel RegisteredClubs;
class RegisteredClubsRepository(CheeseRepository):
	
	#@query "select case when exists 
	# 	(select * from registered_clubs where event_id=:eventId and club_id=:clubId)
	# 	then cast (1 as bit)
	# 	else cast (0 as bit) end;";
	#@return bool;
	@staticmethod
	def isClubRegisteredInEvent(eventId, clubId):
		return CheeseRepository.query(eventId=eventId, clubId=clubId)

	#@query "select * from registered_clubs where event_id=:eventId and club_id=:clubId;";
	#@return one;
	@staticmethod
	def registeredClubInEvent(eventId, clubId):
		return CheeseRepository.query(eventId=eventId, clubId=clubId)

