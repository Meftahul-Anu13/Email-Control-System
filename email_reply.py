from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email_reader import read_emails
from config import MICROSOFT_EMAIL, MICROSOFT_PASSWORD, SMTP_SERVER, SMTP_PORT
import smtplib

def reply_email(email_id, reply_content):
    try:
        # Get the email data (you would typically fetch it from a database or cache)
        emails = read_emails()
        target_email = next((e for e in emails["emails"] if e["id"] == email_id), None)

        if not target_email:
            return {"success": False, "message": "Email not found"}

        # Create a reply email
        reply = MIMEMultipart()
        reply["From"] = MICROSOFT_EMAIL
        reply["To"] = target_email["from"]
        reply["Subject"] = f"Re: {target_email['subject']}"
        reply.attach(MIMEText(reply_content, "plain"))

        # Send the reply
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(MICROSOFT_EMAIL, MICROSOFT_PASSWORD)
            server.sendmail(MICROSOFT_EMAIL, target_email["from"], reply.as_string())
        return {"success": True, "message": "Reply sent successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}
