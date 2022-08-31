
from Cheese.httpClientErrors import *
from Cheese.cheeseController import CheeseController as cc

from src.repositories.registeredTestsRepository import RegisteredTestsRepository

#@controller /registeredTests;
class RegisteredTestsController(cc):

    #@get /getByRegJb;
    @staticmethod
    def getByRegJb(server, path, auth):
        args = cc.getArgs(path)
        cc.checkJson(["regJbId"], args)

        testModels = RegisteredTestsRepository.findWhere(reg_jb_id=args["regJbId"])

        return cc.createResponse({"TESTS": cc.modulesToJsonArray(testModels)})




	

		

