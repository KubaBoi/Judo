#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class Tokens(CheeseModel):
	def __init__(self, id=None, user_id=None, token=None, ip=None):
		self.id=id
		self.user_id=user_id
		self.token=token
		self.ip=ip

	def toJson(self):
		return {
			"ID": self.id,
			"USER_ID": self.user_id,
			"TOKEN": self.token,
			"IP": self.ip
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.user_id = json["USER_ID"]
		self.token = json["TOKEN"]
		self.ip = json["IP"]
