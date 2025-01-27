import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import SMTP_SERVER, SMTP_PORT, MICROSOFT_EMAIL, MICROSOFT_PASSWORD

def send_email(receiver_email, subject, body):
    try:
        # Create email
        message = MIMEMultipart()
        message["From"] = MICROSOFT_EMAIL
        message["To"] = receiver_email
        message["Subject"] = subject
        message.attach(MIMEText(body, "plain"))

        # Connect to SMTP server
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(MICROSOFT_EMAIL, MICROSOFT_PASSWORD)
            server.sendmail(MICROSOFT_EMAIL, receiver_email, message.as_string())
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {e}")
