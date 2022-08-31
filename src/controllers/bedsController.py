#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc

from src.repositories.roomsRepository import RoomsRepository
from src.repositories.bedRepository import BedRepository

#@controller /beds;
class BedsController(cc):

	#@get /roomByRegJb;
    @staticmethod
    def roomByRegJb(server, path, auth):
        args = cc.getArgs(path)
        cc.checkJson(["regJbId"], args)

        bedModel = BedRepository.findOneByColumns(reg_jb_id=args["regJbId"])
        roomModel = RoomsRepository.find(bedModel.room_id)

        return cc.createResponse({"ROOM": roomModel.toJson()})

