#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class Clubs(CheeseModel):
	def __init__(self, id=None, eju=None, user_id=None, state=None, name=None, address=None):
		self.id=id
		self.eju=eju
		self.user_id=user_id
		self.state=state
		self.name=name
		self.address=address

	def toJson(self):
		return {
			"ID": self.id,
			"EJU": self.eju,
			"USER_ID": self.user_id,
			"STATE": self.state,
			"NAME": self.name,
			"ADDRESS": self.address
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.eju = json["EJU"]
		self.user_id = json["USER_ID"]
		self.state = json["STATE"]
		self.name = json["NAME"]
		self.address = json["ADDRESS"]
