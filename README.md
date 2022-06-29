# Judo

Written in Cheese Framework

### Documentation

https://kubaboi.github.io/CheeseFramework

## Install

pip install pdfkit  

sudo apt-get install wkhtmltopdf  

config = pdfkit.configuration(wkhtmltopdf = r"C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe")

pdfkit.from_file("pdfTemp.html", "output.pdf", configuration=config)