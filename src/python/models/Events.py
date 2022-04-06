#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class Events(CheeseModel):
	def __init__(self, id=None, show_hotel=None, pcr_price=None, ag_price=None, trans_price=None, other_price=None, start=None, end=None, arrive=None, depart=None, end_visa=None, end_room=None, organiser_id=None, eju_price=None, name=None, category=None, place=None, visa_phone=None, visa_mail=None):
		self.id=id
		self.show_hotel=show_hotel
		self.pcr_price=pcr_price
		self.ag_price=ag_price
		self.trans_price=trans_price
		self.other_price=other_price
		self.start=start
		self.end=end
		self.arrive=arrive
		self.depart=depart
		self.end_visa=end_visa
		self.end_room=end_room
		self.organiser_id=organiser_id
		self.eju_price=eju_price
		self.name=name
		self.category=category
		self.place=place
		self.visa_phone=visa_phone
		self.visa_mail=visa_mail

	def toJson(self):
		return {
			"ID": self.id,
			"SHOW_HOTEL": self.show_hotel,
			"PCR_PRICE": self.pcr_price,
			"AG_PRICE": self.ag_price,
			"TRANS_PRICE": self.trans_price,
			"OTHER_PRICE": self.other_price,
			"START": self.start,
			"END": self.end,
			"ARRIVE": self.arrive,
			"DEPART": self.depart,
			"END_VISA": self.end_visa,
			"END_ROOM": self.end_room,
			"ORGANISER_ID": self.organiser_id,
			"EJU_PRICE": self.eju_price,
			"NAME": self.name,
			"CATEGORY": self.category,
			"PLACE": self.place,
			"VISA_PHONE": self.visa_phone,
			"VISA_MAIL": self.visa_mail
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.show_hotel = json["SHOW_HOTEL"]
		self.pcr_price = json["PCR_PRICE"]
		self.ag_price = json["AG_PRICE"]
		self.trans_price = json["TRANS_PRICE"]
		self.other_price = json["OTHER_PRICE"]
		self.start = json["START"]
		self.end = json["END"]
		self.arrive = json["ARRIVE"]
		self.depart = json["DEPART"]
		self.end_visa = json["END_VISA"]
		self.end_room = json["END_ROOM"]
		self.organiser_id = json["ORGANISER_ID"]
		self.eju_price = json["EJU_PRICE"]
		self.name = json["NAME"]
		self.category = json["CATEGORY"]
		self.place = json["PLACE"]
		self.visa_phone = json["VISA_PHONE"]
		self.visa_mail = json["VISA_MAIL"]
