#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class Registrations(CheeseModel):
	def __init__(self, id=None, login=None, password=None, phone=None, full_name=None, registration_code=None):
		self.id=id
		self.login=login
		self.password=password
		self.phone=phone
		self.full_name=full_name
		self.registration_code=registration_code

	def toJson(self):
		return {
			"ID": self.id,
			"LOGIN": self.login,
			"PASSWORD": self.password,
			"PHONE": self.phone,
			"FULL_NAME": self.full_name,
			"REGISTRATION_CODE": self.registration_code
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.login = json["LOGIN"]
		self.password = json["PASSWORD"]
		self.phone = json["PHONE"]
		self.full_name = json["FULL_NAME"]
		self.registration_code = json["REGISTRATION_CODE"]
