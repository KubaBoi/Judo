#!/usr/bin/env python
# -*- coding: utf-8 -*-
#AUTOGENERATED FILE

from cheese.databaseControll.database import Database
from cheese.Logger import Logger
from python.models.jb import Jb


class JbRepositoryImpl:

    @staticmethod
    def init():
        JbRepositoryImpl.table = "jb"
        JbRepositoryImpl.scheme = "(id,club_id,birthday,pass_release,pass_expiration,function,pass_id,gender,jb,name,sur_name)"
        JbRepositoryImpl.schemeNoBrackets = "id,club_id,birthday,pass_release,pass_expiration,function,pass_id,gender,jb,name,sur_name"

    @staticmethod
    def convert(var):
        if (type(var) is int):
            var = int(var)
        elif (type(var) is float):
            var = float(var)
        return var

    @staticmethod
    def toJson(object):
        scheme = JbRepositoryImpl.schemeNoBrackets.split(",")
        ret = {}
        for s, o in zip(scheme, list(object)):
            try:
                ret[s] = int(o)
            except:
                ret[s] = o
        return ret

    @staticmethod
    def toModel(obj):
        model = Jb()
        model.id = JbRepositoryImpl.convert(obj[0])
        model.club_id = JbRepositoryImpl.convert(obj[1])
        model.birthday = JbRepositoryImpl.convert(obj[2])
        model.pass_release = JbRepositoryImpl.convert(obj[3])
        model.pass_expiration = JbRepositoryImpl.convert(obj[4])
        model.function = JbRepositoryImpl.convert(obj[5])
        model.pass_id = JbRepositoryImpl.convert(obj[6])
        model.gender = JbRepositoryImpl.convert(obj[7])
        model.jb = JbRepositoryImpl.convert(obj[8])
        model.name = JbRepositoryImpl.convert(obj[9])
        model.sur_name = JbRepositoryImpl.convert(obj[10])
        return model

    @staticmethod
    def fromModel(model):
        tuple = (
            model.id,
            model.club_id,
            model.birthday,
            model.pass_release,
            model.pass_expiration,
            model.function,
            model.pass_id,
            model.gender,
            model.jb,
            model.name,
            model.sur_name
        )
        return tuple

    @staticmethod
    def findAll(args):

        response = None
        try:
            db = Database()
            response = db.query(f"select {JbRepositoryImpl.schemeNoBrackets} from jb;")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        resp = []
        for a in response:
            resp.append(JbRepositoryImpl.toModel(a))
        return resp

    @staticmethod
    def find(args):
        id = args[0]

        response = None
        try:
            db = Database()
            response = db.query(f"select {JbRepositoryImpl.schemeNoBrackets} from jb where id={id};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        if (len(response) > 0):
            return JbRepositoryImpl.toModel(response[0])
        else: return None

    @staticmethod
    def findBy(args):
        columnName = args[0]
        value = args[1]

        response = None
        try:
            db = Database()
            response = db.query(f"select {JbRepositoryImpl.schemeNoBrackets} from jb where {columnName}={value};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        resp = []
        for a in response:
            resp.append(JbRepositoryImpl.toModel(a))
        return resp

    @staticmethod
    def findNewId(args):

        response = None
        try:
            db = Database()
            response = db.query(f"select max(id) from {JbRepositoryImpl.table};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        try: return int(response[0][0])
        except: return -1

    @staticmethod
    def save(args):
        obj = JbRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"insert into {JbRepositoryImpl.table} {JbRepositoryImpl.scheme} values {obj};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def update(args):
        obj = JbRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"update {JbRepositoryImpl.table} set {JbRepositoryImpl.scheme} = {obj} where id={obj[0]};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def delete(args):
        obj = JbRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"delete from {JbRepositoryImpl.table} where id={obj[0]};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False
