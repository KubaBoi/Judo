#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseModel import CheeseModel

#@model
class Jb(CheeseModel):
	def __init__(self, id=None, club_id=None, birthday=None, pass_release=None, pass_expiration=None, function=None, pass_id=None, gender=None, jb=None, name=None, sur_name=None):
		self.id=id
		self.club_id=club_id
		self.birthday=birthday
		self.pass_release=pass_release
		self.pass_expiration=pass_expiration
		self.function=function
		self.pass_id=pass_id
		self.gender=gender
		self.jb=jb
		self.name=name
		self.sur_name=sur_name

	def toJson(self):
		return {
			"ID": self.id,
			"CLUB_ID": self.club_id,
			"BIRTHDAY": self.birthday,
			"PASS_RELEASE": self.pass_release,
			"PASS_EXPIRATION": self.pass_expiration,
			"FUNCTION": self.function,
			"PASS_ID": self.pass_id,
			"GENDER": self.gender,
			"JB": self.jb,
			"NAME": self.name,
			"SUR_NAME": self.sur_name
		}

	def toModel(self, json):
		self.id = json["ID"]
		self.club_id = json["CLUB_ID"]
		self.birthday = json["BIRTHDAY"]
		self.pass_release = json["PASS_RELEASE"]
		self.pass_expiration = json["PASS_EXPIRATION"]
		self.function = json["FUNCTION"]
		self.pass_id = json["PASS_ID"]
		self.gender = json["GENDER"]
		self.jb = json["JB"]
		self.name = json["NAME"]
		self.sur_name = json["SUR_NAME"]
