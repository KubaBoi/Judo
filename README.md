# Judo

Written in Cheese Framework

### Documentation

https://kubaboi.github.io/CheeseFramework

## Install

pip install pdfkit  

pip install openpyxl

sudo apt-get install wkhtmltopdf  

### Centos

wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox-0.12.6-1.centos8.x86_64.rpm

sudo dnf localinstall wkhtmltox-0.12.6-1.centos8.x86_64.rpm

### Windows

config = pdfkit.configuration(wkhtmltopdf = r"C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe")

pdfkit.from_file("pdfTemp.html", "output.pdf", configuration=config)

## disabled registration

/scripts/register.js -> rows 18 - 25

/controllers/usersController.py 

-> 

rows 61 - 79

remove rows 49 - 59