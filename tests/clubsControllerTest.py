
from Cheese.test import UnitTest
from Cheese.pointer import Pointer
from Cheese.mock import *

from Cheese.cheeseModel import CheeseModel
from src.repositories.clubsRepository import ClubsRepository

from src.controllers.clubsController import ClubsController

#@testclass clubs controller tests;
class clubsControllerTest:

    #@test create;
    @staticmethod
    def createTest():
        clubsRepMock = Mock(ClubsRepository)
        serverMock = ServerMock()
        model = Pointer()

        exceptedJson = {
                "STATE": "cz",
                "NAME": "Kuba",
                "ADDRESS": "Address",
                "EJU": "true",
                "USER_ID": 0
            }

        serverMock.mockPostBody(exceptedJson)
        exceptedJson["ID"] = 1

        clubsRepMock.whenReturn("findNewId", 0)
        clubsRepMock.catchArgs(model, "obj", "save")

        rep = ClubsController.create(serverMock, None, None)

        respStr = json.loads(rep[0].decode("utf-8"))
        respCode = rep[1]

        UnitTest.assertEqual(model.getValue().toJson(), exceptedJson, "Model is not as expected")
        UnitTest.assertEqual(respCode, 200, "Http code was not as expected")
        UnitTest.assertEqual(respStr, {"ID": 1}, "String response was not as expected")

    #@test update;
    @staticmethod
    def updateTest():
        clubsRepMock = Mock(ClubsRepository)
        serverMock = ServerMock()
        model = Pointer()
        catchModel = Pointer()
        model.setValue(CheeseModel("Model", []))

        exceptedJson = {
                "ID": 0,
                "STATE": "cz",
                "NAME": "Kuba",
                "ADDRESS": "Address",
                "EJU": "true",
                "USER_ID": 0
            }

        serverMock.mockPostBody(exceptedJson)
        clubsRepMock.whenReturn("find", model, primaryKey=0)
        clubsRepMock.catchArgs(catchModel, "obj", "update")

        rep = ClubsController.update(serverMock, None, None)
        
        respStr = json.loads(rep[0].decode("utf-8"))
        respCode = rep[1]

        UnitTest.assertEqual(catchModel.getValue().toJson(), model.getValue().toJson(), "Model is not as expected")
        UnitTest.assertEqual(respCode, 200, "Http code was not as expected")
        UnitTest.assertEqual(respStr, {"STATUS": "Club has been updated"}, "String response was not as expected")

    #@test get;
    @staticmethod
    def getTest():
        clubsRepMock = Mock(ClubsRepository)

        exceptedJson = {
                "ID": 0,
                "STATE": "cz",
                "NAME": "Kuba",
                "ADDRESS": "Address",
                "EJU": "true",
                "USER_ID": 0
            }
        model = CheeseModel("Model", ["id", "eju", "user_id", "state", "name", "address"])
        setattr(model, "id", 0)
        model.toModel(exceptedJson)

        clubsRepMock.whenReturn("find", model, primaryKey="0")

        rep = ClubsController.get(None, "/clubs/get?clubId=0", None)

        respStr = json.loads(rep[0].decode("utf-8"))
        respCode = rep[1]

        UnitTest.assertEqual(respCode, 200, "Http code was not as expected")
        UnitTest.assertEqual(respStr, {"CLUB": exceptedJson}, "Club in response was not as expected")