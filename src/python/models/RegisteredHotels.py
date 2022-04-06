#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class RegisteredHotels(CheeseModel):
	def __init__(self, id=None, event_id=None, hotel_id=None):
		self.id=id
		self.event_id=event_id
		self.hotel_id=hotel_id

	def toJson(self):
		return {
			"ID": self.id,
			"EVENT_ID": self.event_id,
			"HOTEL_ID": self.hotel_id
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.event_id = json["EVENT_ID"]
		self.hotel_id = json["HOTEL_ID"]
