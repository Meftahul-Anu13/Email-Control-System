from email_reader import read_emails

def move_from_spam():
    read_emails(folder="[Gmail]/Spam")  # For Gmail's spam folder
    # Logic to move emails to the inbox would depend on IMAP commands
    print("Checked spam folder. Add logic to move important emails.")
