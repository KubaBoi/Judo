#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class RegisteredClubs(CheeseModel):
	def __init__(self, id=None, event_id=None, club_id=None, visa=None, checked=None):
		self.id=id
		self.event_id=event_id
		self.club_id=club_id
		self.visa=visa
		self.checked=checked

	def toJson(self):
		return {
			"ID": self.id,
			"EVENT_ID": self.event_id,
			"CLUB_ID": self.club_id,
			"VISA": self.visa,
			"CHECKED": self.checked
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.event_id = json["EVENT_ID"]
		self.club_id = json["CLUB_ID"]
		self.visa = json["VISA"]
		self.checked = json["CHECKED"]
