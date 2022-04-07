#!/usr/bin/env python
# -*- coding: utf-8 -*-
#AUTOGENERATED FILE

from cheese.databaseControll.database import Database
from cheese.Logger import Logger
from python.models.Bed import Bed


class BedRepositoryImpl:

    @staticmethod
    def init():
        BedRepositoryImpl.table = "bed"
        BedRepositoryImpl.scheme = "(id,room_id,jb_id)"
        BedRepositoryImpl.schemeNoBrackets = "id,room_id,jb_id"

    @staticmethod
    def convert(var):
        if (type(var) is int):
            var = int(var)
        elif (type(var) is float):
            var = float(var)
        return var

    @staticmethod
    def toJson(object):
        scheme = BedRepositoryImpl.schemeNoBrackets.split(",")
        ret = {}
        for s, o in zip(scheme, list(object)):
            try:
                ret[s] = int(o)
            except:
                ret[s] = o
        return ret

    @staticmethod
    def toModel(obj):
        model = Bed()
        model.id = BedRepositoryImpl.convert(obj[0])
        model.room_id = BedRepositoryImpl.convert(obj[1])
        model.jb_id = BedRepositoryImpl.convert(obj[2])
        return model

    @staticmethod
    def fromModel(model):
        tuple = (
            model.id,
            model.room_id,
            model.jb_id
        )
        return tuple

    @staticmethod
    def findAll(args):

        response = None
        try:
            db = Database()
            response = db.query(f"select {BedRepositoryImpl.schemeNoBrackets} from bed;")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        resp = []
        for a in response:
            resp.append(BedRepositoryImpl.toModel(a))
        return resp

    @staticmethod
    def find(args):
        id = args[0]

        response = None
        try:
            db = Database()
            response = db.query(f"select {BedRepositoryImpl.schemeNoBrackets} from bed where id={id};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        if (len(response) > 0):
            return BedRepositoryImpl.toModel(response[0])
        else: return None

    @staticmethod
    def findBy(args):
        columnName = args[0]
        value = args[1]

        response = None
        try:
            db = Database()
            response = db.query(f"select {BedRepositoryImpl.schemeNoBrackets} from bed where {columnName}={value};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        resp = []
        for a in response:
            resp.append(BedRepositoryImpl.toModel(a))
        return resp

    @staticmethod
    def findNewId(args):

        try:
            db = Database()
            db.commit(f"select max(id) from {BedRepositoryImpl.table};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def save(args):
        obj = BedRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"insert into {BedRepositoryImpl.table} {BedRepositoryImpl.scheme} values {obj};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def update(args):
        obj = BedRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"update {BedRepositoryImpl.table} set {BedRepositoryImpl.scheme} = {obj} where id={obj[0]};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def delete(args):
        obj = BedRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"delete from {BedRepositoryImpl.table} where id={obj[0]};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

