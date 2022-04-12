#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class RegisteredTests(CheeseModel):
	def __init__(self, id=None, reg_jb_id=None, pcr=None, date=None):
		self.id=id
		self.reg_jb_id=reg_jb_id
		self.pcr=pcr
		self.date=date

	def toJson(self):
		return {
			"ID": self.id,
			"REG_JB_ID": self.reg_jb_id,
			"PCR": self.pcr,
			"DATE": self.date
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.reg_jb_id = json["REG_JB_ID"]
		self.pcr = json["PCR"]
		self.date = json["DATE"]
