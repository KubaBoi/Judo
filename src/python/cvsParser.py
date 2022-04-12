import os

from cheese.resourceManager import ResMan

class CVSparser:

    @staticmethod
    def parse(file):
        with open(os.path.join(ResMan.resources(), "cvs", file), "r", encoding="utf-8") as f:
            dataLines = f.readlines()

        jsonReturn = {}
        jsonReturn["ARRAY"] = []

        for line in dataLines:
            data = line.strip().split("\t")
            person = {}
            person["JB"] = data[1]
            person["SUR_NAME"] = data[2]
            person["NAME"] = data[3]
            person["STATE"] = data[4]
            person["BIRTHDAY"] = data[7]
            person["FUNCTION"] = data[8]
            person["GENDER"] = data[9]
            jsonReturn["ARRAY"].append(person)

        os.remove(os.path.join(ResMan.resources(), "cvs", file))

        return jsonReturn


