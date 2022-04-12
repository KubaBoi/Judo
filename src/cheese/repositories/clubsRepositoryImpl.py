#!/usr/bin/env python
# -*- coding: utf-8 -*-
#AUTOGENERATED FILE

from cheese.databaseControll.database import Database
from cheese.Logger import Logger
from python.models.clubs import Clubs


class ClubsRepositoryImpl:

    @staticmethod
    def init():
        ClubsRepositoryImpl.table = "clubs"
        ClubsRepositoryImpl.scheme = "(id,eju,user_id,state,name,address)"
        ClubsRepositoryImpl.schemeNoBrackets = "id,eju,user_id,state,name,address"

    @staticmethod
    def convert(var):
        if (type(var) is int):
            var = int(var)
        elif (type(var) is float):
            var = float(var)
        return var

    @staticmethod
    def toJson(object):
        scheme = ClubsRepositoryImpl.schemeNoBrackets.split(",")
        ret = {}
        for s, o in zip(scheme, list(object)):
            try:
                ret[s] = int(o)
            except:
                ret[s] = o
        return ret

    @staticmethod
    def toModel(obj):
        model = Clubs()
        model.id = ClubsRepositoryImpl.convert(obj[0])
        model.eju = ClubsRepositoryImpl.convert(obj[1])
        model.user_id = ClubsRepositoryImpl.convert(obj[2])
        model.state = ClubsRepositoryImpl.convert(obj[3])
        model.name = ClubsRepositoryImpl.convert(obj[4])
        model.address = ClubsRepositoryImpl.convert(obj[5])
        return model

    @staticmethod
    def fromModel(model):
        tuple = (
            model.id,
            model.eju,
            model.user_id,
            model.state,
            model.name,
            model.address
        )
        return tuple

    @staticmethod
    def findAll(args):

        response = None
        try:
            db = Database()
            response = db.query(f"select {ClubsRepositoryImpl.schemeNoBrackets} from clubs;")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        resp = []
        for a in response:
            resp.append(ClubsRepositoryImpl.toModel(a))
        return resp

    @staticmethod
    def find(args):
        id = args[0]

        response = None
        try:
            db = Database()
            response = db.query(f"select {ClubsRepositoryImpl.schemeNoBrackets} from clubs where id={id};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        if (len(response) > 0):
            return ClubsRepositoryImpl.toModel(response[0])
        else: return None

    @staticmethod
    def findBy(args):
        columnName = args[0]
        value = args[1]

        response = None
        try:
            db = Database()
            response = db.query(f"select {ClubsRepositoryImpl.schemeNoBrackets} from clubs where {columnName}={value};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        resp = []
        for a in response:
            resp.append(ClubsRepositoryImpl.toModel(a))
        return resp

    @staticmethod
    def findNewId(args):

        response = None
        try:
            db = Database()
            response = db.query(f"select max(id) from {ClubsRepositoryImpl.table};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        try: return int(response[0][0])
        except: return -1

    @staticmethod
    def save(args):
        obj = ClubsRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"insert into {ClubsRepositoryImpl.table} {ClubsRepositoryImpl.scheme} values {obj};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def update(args):
        obj = ClubsRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"update {ClubsRepositoryImpl.table} set {ClubsRepositoryImpl.scheme} = {obj} where id={obj[0]};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def delete(args):
        obj = ClubsRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"delete from {ClubsRepositoryImpl.table} where id={obj[0]};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False
