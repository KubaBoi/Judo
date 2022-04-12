#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class Users(CheeseModel):
	def __init__(self, id=None, rule_id=None, login=None, phone=None, full_name=None):
		self.id=id
		self.rule_id=rule_id
		self.login=login
		self.phone=phone
		self.full_name=full_name

	def toJson(self):
		return {
			"ID": self.id,
			"RULE_ID": self.rule_id,
			"LOGIN": self.login,
			"PHONE": self.phone,
			"FULL_NAME": self.full_name
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.rule_id = json["RULE_ID"]
		self.login = json["LOGIN"]
		self.phone = json["PHONE"]
		self.full_name = json["FULL_NAME"]
