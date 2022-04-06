#!/usr/bin/env python
# -*- coding: utf-8 -*-

import time

from cheese.modules.cheeseController import CheeseController as cc
from cheese.ErrorCodes import Error

#@controller /clubs
class clubController(cc):

    #@post /create
    @staticmethod
    def createNotification(server, path, auth):
        args = cc.readArgs(server)

        if (not cc.validateJson(["DESCRIPTION", "END_TIME", "REPEAT"], args)):
            Error.sendCustomError(server, "Wrong json structure", 400)
            return

        notification = Notification()
        args["ID"] = NotificationRepository.findNewId()
        notification.toModel(args)

        NotificationRepository.save(notification)

        response = cc.createResponse({"OK": "OK"}, 200)
        cc.sendResponse(server, response)


