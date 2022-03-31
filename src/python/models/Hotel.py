from urllib import response
from cheese.modules.cheeseModel import CheeseModel

from python.models.Room import Room

#@model
class Hotel(CheeseModel):

    def __init__(self, id=None, title=None, street=None, city=None, zip=None, email=None, phone=None, web=None):
        self.id = id
        self.title = title
        self.street = street
        self.city = city
        self.zip = zip
        self.email = email
        self.phone = phone
        self.web = web
        self.rooms = []

    def toJson(self):
        jsonRooms = []
        for room in self.rooms:
            jsonRooms.append(room.toJson())

        response = {
            "ID": self.id,
            "TITLE": self.title,
            "STREET": self.street,
            "CITY": self.city,
            "ZIP": self.zip,
            "EMAIL": self.email,
            "PHONE": self.phone,
            "WEB": self.web,
            "ROOMS": jsonRooms
        }
        return response

    def toModel(self, json):
        self.id = json["ID"]
        self.title = json["TITLE"]
        self.street = json["STREET"]
        self.city = json["CITY"]
        self.zip = json["ZIP"]
        self.email = json["EMAIL"]
        self.phone = json["PHONE"]
        self.web = json["WEB"]

        self.rooms = []
        for room in json["ROOMS"]:
            newRoom = Room()
            newRoom.toModel(room)
            self.rooms.append(newRoom)
