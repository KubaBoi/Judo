from bs4 import BeautifulSoup
import json

pth = "C:\\Users\\Jakub Anderle\\Desktop\\programy\\Judo\\resources\\wikiCountryCodesScrape.html"

with open(pth, "r", encoding="utf-8") as f:
    data = f.read()

dataList = []

soup = BeautifulSoup(data)

imgs = soup.find_all("img")
for img in imgs:
    d = {}
    d["src"] = img.get("src")
    dataList.append(d)

codes = soup.find_all("span", {"class": "monospaced"})
for i, code in enumerate(codes):
    dataList[i]["code"] = code.get_text()

links = soup.find_all("a")
i = 0
for link in links:
    if (link.get("title") == None): continue
    if (not link.get("title").endswith("at the Olympics")): continue
    dataList[i]["text"] = link.get_text()
    i += 1

with open("./countryData.json", "w", encoding="utf-8") as f:
    f.write(json.dumps({"dataList": dataList}, indent=4, sort_keys=True))

optionsString = """<select id="stateInpEdit">\n"""
for country in dataList:
    optionsString += f"""\t<option value="{country['code']}">{country['text']}</option>\n"""
optionsString += "</select>"

with open("./countryCodes.html", "w", encoding="utf-8") as f:
    f.write(optionsString)