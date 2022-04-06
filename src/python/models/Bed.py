#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class Bed(CheeseModel):
	def __init__(self, id=None, room_id=None, jb_id=None):
		self.id=id
		self.room_id=room_id
		self.jb_id=jb_id

	def toJson(self):
		return {
			"ID": self.id,
			"ROOM_ID": self.room_id,
			"JB_ID": self.jb_id
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.room_id = json["ROOM_ID"]
		self.jb_id = json["JB_ID"]
