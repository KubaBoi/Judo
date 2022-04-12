#!/usr/bin/env python
# -*- coding: utf-8 -*-
#AUTOGENERATED FILE

from cheese.databaseControll.database import Database
from cheese.Logger import Logger
from python.models.Rooms import Rooms


class RoomsRepositoryImpl:

    @staticmethod
    def init():
        RoomsRepositoryImpl.table = "rooms"
        RoomsRepositoryImpl.scheme = "(id,bed,price,hotel_id,available)"
        RoomsRepositoryImpl.schemeNoBrackets = "id,bed,price,hotel_id,available"

    @staticmethod
    def convert(var):
        if (type(var) is int):
            var = int(var)
        elif (type(var) is float):
            var = float(var)
        return var

    @staticmethod
    def toJson(object):
        scheme = RoomsRepositoryImpl.schemeNoBrackets.split(",")
        ret = {}
        for s, o in zip(scheme, list(object)):
            try:
                ret[s] = int(o)
            except:
                ret[s] = o
        return ret

    @staticmethod
    def toModel(obj):
        model = Rooms()
        model.id = RoomsRepositoryImpl.convert(obj[0])
        model.bed = RoomsRepositoryImpl.convert(obj[1])
        model.price = RoomsRepositoryImpl.convert(obj[2])
        model.hotel_id = RoomsRepositoryImpl.convert(obj[3])
        model.available = RoomsRepositoryImpl.convert(obj[4])
        return model

    @staticmethod
    def fromModel(model):
        tuple = (
            model.id,
            model.bed,
            model.price,
            model.hotel_id,
            model.available
        )
        return tuple

    @staticmethod
    def findAll(args):

        response = None
        try:
            db = Database()
            response = db.query(f"select {RoomsRepositoryImpl.schemeNoBrackets} from rooms;")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        resp = []
        for a in response:
            resp.append(RoomsRepositoryImpl.toModel(a))
        return resp

    @staticmethod
    def find(args):
        id = args[0]

        response = None
        try:
            db = Database()
            response = db.query(f"select {RoomsRepositoryImpl.schemeNoBrackets} from rooms where id={id};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        if (len(response) > 0):
            return RoomsRepositoryImpl.toModel(response[0])
        else: return None

    @staticmethod
    def findBy(args):
        columnName = args[0]
        value = args[1]

        response = None
        try:
            db = Database()
            response = db.query(f"select {RoomsRepositoryImpl.schemeNoBrackets} from rooms where {columnName}={value};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        resp = []
        for a in response:
            resp.append(RoomsRepositoryImpl.toModel(a))
        return resp

    @staticmethod
    def findNewId(args):

        response = None
        try:
            db = Database()
            response = db.query(f"select max(id) from {RoomsRepositoryImpl.table};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        try: return int(response[0][0])
        except: return -1

    @staticmethod
    def save(args):
        obj = RoomsRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"insert into {RoomsRepositoryImpl.table} {RoomsRepositoryImpl.scheme} values {obj};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def update(args):
        obj = RoomsRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"update {RoomsRepositoryImpl.table} set {RoomsRepositoryImpl.scheme} = {obj} where id={obj[0]};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def delete(args):
        obj = RoomsRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"delete from {RoomsRepositoryImpl.table} where id={obj[0]};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

