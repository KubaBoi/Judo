import os

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from cheese.resourceManager import ResMan

class EmailSender:

    @staticmethod
    def sendRegistrationEmail(email, code):

        smtp_user = "anticary@gmail.com"
        smtp_password = "bvenlqqlsbdowwxg"
        server = "smtp.gmail.com"
        port = 587
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Registration confirmation"
        msg["From"] = smtp_user
        msg["To"] = email

        with open(os.path.join(ResMan.resources(), "emails", "registrationConfirmation.html"), "r") as f:
            html = f.read().replace("$CODE$", code + ".html")

        part2 = MIMEText(html, "html")
        msg.attach(part2)

        s = smtplib.SMTP(server, port)
        s.ehlo()
        s.starttls()
        s.login(smtp_user, smtp_password)
        s.sendmail(smtp_user, email, msg.as_string())
        s.quit()
