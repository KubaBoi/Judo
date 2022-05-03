from urllib.parse import unquote
from Cheese.cheeseController import CheeseController

#@authorization enabled
class Authorization:

    @staticmethod
    def authorize(server, path, method):
        return {"role": 0}