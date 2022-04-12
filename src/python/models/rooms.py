#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class Rooms(CheeseModel):
	def __init__(self, id=None, bed=None, price=None, hotel_id=None, available=None):
		self.id=id
		self.bed=bed
		self.price=price
		self.hotel_id=hotel_id
		self.available=available

	def toJson(self):
		return {
			"ID": self.id,
			"BED": self.bed,
			"PRICE": self.price,
			"HOTEL_ID": self.hotel_id,
			"AVAILABLE": self.available
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.bed = json["BED"]
		self.price = json["PRICE"]
		self.hotel_id = json["HOTEL_ID"]
		self.available = json["AVAILABLE"]
