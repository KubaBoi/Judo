#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.cheeseRepository import CheeseRepository

#@repository events;
#@dbscheme (id, show_hotel, pcr_price, ag_price, trans_price, other_price, event_start, event_end, arrive, depart, end_visa, end_room, organiser_id, eju_price, name, category, place, visa_phone, visa_mail);
#@dbmodel Events;
class EventsRepository(CheeseRepository):

	#@query "select * from events order by :columnName ASC;";
	#@return array;
	@staticmethod
	def findBySorted(columnName):
		return CheeseRepository.query(columnName="columnName-"+columnName)

