#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class Roles(CheeseModel):
	def __init__(self, id=None, desc=None):
		self.id=id
		self.desc=desc

	def toJson(self):
		return {
			"ID": self.id,
			"DESC": self.desc
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.desc = json["DESC"]
