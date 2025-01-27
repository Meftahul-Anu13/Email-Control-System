import imaplib
import email
from email.utils import parsedate_tz, mktime_tz
from config import MICROSOFT_EMAIL, MICROSOFT_PASSWORD, IMAP_SERVER, IMAP_PORT

def view_sent_emails(folder="Sent", limit=10):
    try:
        # Connect to the IMAP server
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        mail.login(MICROSOFT_EMAIL, MICROSOFT_PASSWORD)
        mail.select(folder)

        # Search for all sent emails
        _, messages = mail.search(None, "ALL")
        email_ids = messages[0].split()
        emails = []

        for eid in email_ids[-limit:]:
            _, msg_data = mail.fetch(eid, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    emails.append({
                        "id": eid.decode(),
                        "subject": msg["Subject"],
                        "to": msg["To"],
                        "date": get_email_date(msg)
                    })

        mail.logout()
        return {"success": True, "emails": emails}
    except Exception as e:
        return {"success": False, "message": str(e)}

def get_email_details(email_id):
    try:
        # Connect to the IMAP server
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        mail.login(MICROSOFT_EMAIL, MICROSOFT_PASSWORD)
        mail.select("Sent")  # Change folder if necessary

        # Fetch the specific email by ID
        _, msg_data = mail.fetch(email_id, "(RFC822)")
        for response_part in msg_data:
            if isinstance(response_part, tuple):
                msg = email.message_from_bytes(response_part[1])
                email_details = {
                    "subject": msg["Subject"],
                    "from": msg["From"],
                    "to": msg["To"],
                    "date": get_email_date(msg),
                    "body": get_email_body(msg),
                }

        mail.logout()
        return {"success": True, "email_details": email_details}
    except Exception as e:
        return {"success": False, "message": str(e)}

def get_email_date(msg):
    # Parse the "Date" header to get the received time
    date_tuple = parsedate_tz(msg["Date"])
    if date_tuple:
        return mktime_tz(date_tuple)
    return None

def get_email_body(msg):
    # Extract the body of the email
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))

            if "attachment" not in content_disposition:
                if content_type == "text/plain":
                    body = part.get_payload(decode=True).decode()
                    return body
    else:
        return msg.get_payload(decode=True).decode()

