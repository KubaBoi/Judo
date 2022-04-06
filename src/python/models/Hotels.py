#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class Hotels(CheeseModel):
	def __init__(self, id=None, package=None, p_nights=None, mail=None, web=None, phone=None, name=None, address=None):
		self.id=id
		self.package=package
		self.p_nights=p_nights
		self.mail=mail
		self.web=web
		self.phone=phone
		self.name=name
		self.address=address

	def toJson(self):
		return {
			"ID": self.id,
			"PACKAGE": self.package,
			"P_NIGHTS": self.p_nights,
			"MAIL": self.mail,
			"WEB": self.web,
			"PHONE": self.phone,
			"NAME": self.name,
			"ADDRESS": self.address
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.package = json["PACKAGE"]
		self.p_nights = json["P_NIGHTS"]
		self.mail = json["MAIL"]
		self.web = json["WEB"]
		self.phone = json["PHONE"]
		self.name = json["NAME"]
		self.address = json["ADDRESS"]
