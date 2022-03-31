from cheese.modules.cheeseModel import CheeseModel

#@model
class User(CheeseModel):

    def __init__(self, id=None, account_name=None, user_name=None):
        self.id = id
        self.account_name = account_name
        self.user_name = user_name

    def toJson(self):
        response = {
            "ID": self.id,
            "ACCOUNT_NAME": self.account_name,
            "USER_NAME": self.user_name
        }
        return response