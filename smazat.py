
with open("cont_cup_cad_cze2022_names-1.txt", "r") as f:
    data = f.read()

lines = data.split("\n")
czLines = []

for line in lines:
    if (line.find("CZE") == -1): continue
    czLines.append(line)

with open("cze.txt", "w") as f:
    for line in czLines:
        f.write(line + "\n")