#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class Passwords(CheeseModel):
	def __init__(self, id=None, password=None, login=None):
		self.id=id
		self.password=password
		self.login=login

	def toJson(self):
		return {
			"ID": self.id,
			"PASSWORD": self.password,
			"LOGIN": self.login
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.password = json["PASSWORD"]
		self.login = json["LOGIN"]
