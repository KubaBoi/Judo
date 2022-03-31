from cheese.modules.cheeseModel import CheeseModel

#@model
class Room(CheeseModel):

    def __init__(self, id=None, hotel_id=None, bed=None, count=None, price_RO=None, price_BB=None, price_HB=None, price_FB=None):
        self.id = id
        self.hotel_id = hotel_id
        self.bed = bed
        self.count = count
        self.price_RO = price_RO
        self.price_BB = price_BB
        self.price_HB = price_HB
        self.price_FB = price_FB

    def toJson(self):
        response = {
            "ID": self.id,
            "HOTEL_ID": self.hotel_id,
            "BED": self.bed,
            "COUNT": self.count,
            "PRICE_RO": self.price_RO,
            "PRICE_BB": self.price_BB,
            "PRICE_HB": self.price_HB,
            "PRICE_FB": self.price_FB
        }
        return response

    def toModel(self, json):
        self.id = json["ID"]
        self.hotel_id = json["HOTEL_ID"]
        self.bed = json["BED"]
        self.count = self.convertToInt(json["COUNT"])
        self.price_RO = self.convertToInt(json["PRICE_RO"])
        self.price_BB = self.convertToInt(json["PRICE_BB"])
        self.price_HB = self.convertToInt(json["PRICE_HB"])
        self.price_FB = self.convertToInt(json["PRICE_FB"])

    def convertToInt(self, value):
        if (value == ''):
            return 0
        return int(value)