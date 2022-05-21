
import os
import json

settPath = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "appSettings.json"))

with open(settPath, "r") as f:
    data = json.loads(f.read())

v = data["version"]
v.split(".")
v = ".".join([v[0], v[1], str(int(v[2])+1)])

data["version"] = v

with open(settPath, "w") as f:
    f.write(json.dumps(data))

print("Promoted to version " + v)