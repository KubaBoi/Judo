from cheese.modules.cheeseModel import CheeseModel

#@model
class Token(CheeseModel):

    def __init__(self, id=None, token=None, user_id=None, ip=None):
        self.id = id
        self.token = token
        self.user_id = user_id
        self.ip = ip

    def toJson(self):
        response = {
            "ID": self.id,
            "TOKEN": self.token,
            "USER_ID": self.user_id,
            "IP": self.ip
        }
        return response