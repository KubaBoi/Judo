#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class RegisteredJb(CheeseModel):
	def __init__(self, id=None, reg_club_id=None, jb_id=None, arrive=None, departure=None, transport=None):
		self.id=id
		self.reg_club_id=reg_club_id
		self.jb_id=jb_id
		self.arrive=arrive
		self.departure=departure
		self.transport=transport

	def toJson(self):
		return {
			"ID": self.id,
			"REG_CLUB_ID": self.reg_club_id,
			"JB_ID": self.jb_id,
			"ARRIVE": self.arrive,
			"DEPARTURE": self.departure,
			"TRANSPORT": self.transport
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.reg_club_id = json["REG_CLUB_ID"]
		self.jb_id = json["JB_ID"]
		self.arrive = json["ARRIVE"]
		self.departure = json["DEPARTURE"]
		self.transport = json["TRANSPORT"]
