#!/usr/bin/env python
# -*- coding: utf-8 -*-
#AUTOGENERATED FILE

from cheese.databaseControll.database import Database
from cheese.Logger import Logger
from python.models.Passwords import Passwords


class PasswordsRepositoryImpl:

    @staticmethod
    def init():
        PasswordsRepositoryImpl.table = "passwords"
        PasswordsRepositoryImpl.scheme = "(id,password,login)"
        PasswordsRepositoryImpl.schemeNoBrackets = "id,password,login"

    @staticmethod
    def convert(var):
        if (type(var) is int):
            var = int(var)
        elif (type(var) is float):
            var = float(var)
        return var

    @staticmethod
    def toJson(object):
        scheme = PasswordsRepositoryImpl.schemeNoBrackets.split(",")
        ret = {}
        for s, o in zip(scheme, list(object)):
            try:
                ret[s] = int(o)
            except:
                ret[s] = o
        return ret

    @staticmethod
    def toModel(obj):
        model = Passwords()
        model.id = PasswordsRepositoryImpl.convert(obj[0])
        model.password = PasswordsRepositoryImpl.convert(obj[1])
        model.login = PasswordsRepositoryImpl.convert(obj[2])
        return model

    @staticmethod
    def fromModel(model):
        tuple = (
            model.id,
            model.password,
            model.login
        )
        return tuple

    @staticmethod
    def login(args):
        login = args[0]
        password = args[1]

        response = None
        try:
            db = Database()
            response = db.query(f"select case when exists (select * from passwords p where p.login = {login} and p.password = {password}) then cast(1 as bit) else cast(0 as bit) end;")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        if (response[0][0] == "1"): return True
        return False

    @staticmethod
    def findAll(args):

        response = None
        try:
            db = Database()
            response = db.query(f"select {PasswordsRepositoryImpl.schemeNoBrackets} from passwords;")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        resp = []
        for a in response:
            resp.append(PasswordsRepositoryImpl.toModel(a))
        return resp

    @staticmethod
    def find(args):
        id = args[0]

        response = None
        try:
            db = Database()
            response = db.query(f"select {PasswordsRepositoryImpl.schemeNoBrackets} from passwords where id={id};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        if (len(response) > 0):
            return PasswordsRepositoryImpl.toModel(response[0])
        else: return None

    @staticmethod
    def findBy(args):
        columnName = args[0]
        value = args[1]

        response = None
        try:
            db = Database()
            response = db.query(f"select {PasswordsRepositoryImpl.schemeNoBrackets} from passwords where {columnName}={value};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        resp = []
        for a in response:
            resp.append(PasswordsRepositoryImpl.toModel(a))
        return resp

    @staticmethod
    def findNewId(args):

        try:
            db = Database()
            db.commit(f"select max(id) from {PasswordsRepositoryImpl.table};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def save(args):
        obj = PasswordsRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"insert into {PasswordsRepositoryImpl.table} {PasswordsRepositoryImpl.scheme} values {obj};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def update(args):
        obj = PasswordsRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"update {PasswordsRepositoryImpl.table} set {PasswordsRepositoryImpl.scheme} = {obj} where id={obj[0]};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def delete(args):
        obj = PasswordsRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"delete from {PasswordsRepositoryImpl.table} where id={obj[0]};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

