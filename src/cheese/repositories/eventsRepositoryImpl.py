#!/usr/bin/env python
# -*- coding: utf-8 -*-
#AUTOGENERATED FILE

from cheese.databaseControll.database import Database
from cheese.Logger import Logger
from python.models.events import Events


class EventsRepositoryImpl:

    @staticmethod
    def init():
        EventsRepositoryImpl.table = "events"
        EventsRepositoryImpl.scheme = "(id,show_hotel,pcr_price,ag_price,trans_price,other_price,event_start,event_end,arrive,depart,end_visa,end_room,organiser_id,eju_price,name,category,place,visa_phone,visa_mail)"
        EventsRepositoryImpl.schemeNoBrackets = "id,show_hotel,pcr_price,ag_price,trans_price,other_price,event_start,event_end,arrive,depart,end_visa,end_room,organiser_id,eju_price,name,category,place,visa_phone,visa_mail"

    @staticmethod
    def convert(var):
        if (type(var) is int):
            var = int(var)
        elif (type(var) is float):
            var = float(var)
        return var

    @staticmethod
    def toJson(object):
        scheme = EventsRepositoryImpl.schemeNoBrackets.split(",")
        ret = {}
        for s, o in zip(scheme, list(object)):
            try:
                ret[s] = int(o)
            except:
                ret[s] = o
        return ret

    @staticmethod
    def toModel(obj):
        model = Events()
        model.id = EventsRepositoryImpl.convert(obj[0])
        model.show_hotel = EventsRepositoryImpl.convert(obj[1])
        model.pcr_price = EventsRepositoryImpl.convert(obj[2])
        model.ag_price = EventsRepositoryImpl.convert(obj[3])
        model.trans_price = EventsRepositoryImpl.convert(obj[4])
        model.other_price = EventsRepositoryImpl.convert(obj[5])
        model.event_start = EventsRepositoryImpl.convert(obj[6])
        model.event_end = EventsRepositoryImpl.convert(obj[7])
        model.arrive = EventsRepositoryImpl.convert(obj[8])
        model.depart = EventsRepositoryImpl.convert(obj[9])
        model.end_visa = EventsRepositoryImpl.convert(obj[10])
        model.end_room = EventsRepositoryImpl.convert(obj[11])
        model.organiser_id = EventsRepositoryImpl.convert(obj[12])
        model.eju_price = EventsRepositoryImpl.convert(obj[13])
        model.name = EventsRepositoryImpl.convert(obj[14])
        model.category = EventsRepositoryImpl.convert(obj[15])
        model.place = EventsRepositoryImpl.convert(obj[16])
        model.visa_phone = EventsRepositoryImpl.convert(obj[17])
        model.visa_mail = EventsRepositoryImpl.convert(obj[18])
        return model

    @staticmethod
    def fromModel(model):
        tuple = (
            model.id,
            model.show_hotel,
            model.pcr_price,
            model.ag_price,
            model.trans_price,
            model.other_price,
            model.event_start,
            model.event_end,
            model.arrive,
            model.depart,
            model.end_visa,
            model.end_room,
            model.organiser_id,
            model.eju_price,
            model.name,
            model.category,
            model.place,
            model.visa_phone,
            model.visa_mail
        )
        return tuple

    @staticmethod
    def findBySorted(args):
        columnName = args[0]

        response = None
        try:
            db = Database()
            response = db.query(f"select {EventsRepositoryImpl.schemeNoBrackets} from events order by {columnName} ASC;")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        resp = []
        for a in response:
            resp.append(EventsRepositoryImpl.toModel(a))
        return resp

    @staticmethod
    def findAll(args):

        response = None
        try:
            db = Database()
            response = db.query(f"select {EventsRepositoryImpl.schemeNoBrackets} from events;")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        resp = []
        for a in response:
            resp.append(EventsRepositoryImpl.toModel(a))
        return resp

    @staticmethod
    def find(args):
        id = args[0]

        response = None
        try:
            db = Database()
            response = db.query(f"select {EventsRepositoryImpl.schemeNoBrackets} from events where id={id};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        if (len(response) > 0):
            return EventsRepositoryImpl.toModel(response[0])
        else: return None

    @staticmethod
    def findBy(args):
        columnName = args[0]
        value = args[1]

        response = None
        try:
            db = Database()
            response = db.query(f"select {EventsRepositoryImpl.schemeNoBrackets} from events where {columnName}={value};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        resp = []
        for a in response:
            resp.append(EventsRepositoryImpl.toModel(a))
        return resp

    @staticmethod
    def findNewId(args):

        response = None
        try:
            db = Database()
            response = db.query(f"select max(id) from {EventsRepositoryImpl.table};")
            db.done()
        except Exception as e:
            Logger.fail("An error occurred while query request", str(e))

        if (response == None): return response
        try: return int(response[0][0])
        except: return -1

    @staticmethod
    def save(args):
        obj = EventsRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"insert into {EventsRepositoryImpl.table} {EventsRepositoryImpl.scheme} values {obj};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def update(args):
        obj = EventsRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"update {EventsRepositoryImpl.table} set {EventsRepositoryImpl.scheme} = {obj} where id={obj[0]};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

    @staticmethod
    def delete(args):
        obj = EventsRepositoryImpl.fromModel(args[0])

        try:
            db = Database()
            db.commit(f"delete from {EventsRepositoryImpl.table} where id={obj[0]};")
            db.done()
            return True
        except Exception as e:
            Logger.fail("An error occurred while commit request", str(e))
            return False

