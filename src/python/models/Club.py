from urllib import response
from cheese.modules.cheeseModel import CheeseModel

#@model
class Club(CheeseModel):

    def __init__(self, id=None, title=None, code=None, eju=None, street=None, city=None, zip=None, email=None, phone=None, web=None):
        self.id = id
        self.title = title
        self.code = code
        self.eju = eju
        self.street = street
        self.city = city
        self.zip = zip
        self.email = email
        self.phone = phone
        self.web = web
        self.rooms = []

    def toJson(self):
        response = {
            "ID": self.id,
            "TITLE": self.title,
            "CODE": self.code,
            "EJU": self.eju,
            "STREET": self.street,
            "CITY": self.city,
            "ZIP": self.zip,
            "EMAIL": self.email,
            "PHONE": self.phone,
            "WEB": self.web,
        }
        return response

    def toModel(self, json):
        self.id = json["ID"]
        self.title = json["TITLE"]
        self.code = json["CODE"]
        self.eju = json["EJU"]
        self.street = json["STREET"]
        self.city = json["CITY"]
        self.zip = json["ZIP"]
        self.email = json["EMAIL"]
        self.phone = json["PHONE"]
        self.web = json["WEB"]
