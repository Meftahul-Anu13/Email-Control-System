from flask import Flask, request, jsonify, render_template
from email_sender import send_email
from email_reader import read_emails
from email_reply import reply_email
from email_spam import move_from_spam
from email_sent import view_sent_emails, get_email_details  

app = Flask(__name__)


@app.route("/")
def home():
    # return render_template("index.html")
    return "Welcome to Email API"

@app.route("/send_email", methods=["POST"])
def api_send_email():
    data = request.json
    return jsonify(send_email(data["recipient"], data["subject"], data["content"]))

@app.route("/read_emails", methods=["GET"])
def api_read_emails():
    folder = request.args.get("folder", "INBOX")
    limit = int(request.args.get("limit", 10))
    return jsonify(read_emails(folder, limit))

@app.route("/reply_email", methods=["POST"])
def api_reply_email():
    data = request.json
    return jsonify(reply_email(data["email_id"], data["content"]))

@app.route("/move_spam", methods=["POST"])
def api_move_spam():
    return jsonify(move_from_spam())

@app.route("/email_sent", methods=["GET"])
def api_view_sent_emails():
    limit = int(request.args.get("limit", 10))
    return jsonify(view_sent_emails(limit=limit))

@app.route("/view_email_details/<email_id>", methods=["GET"])
def api_view_email_details(email_id):
    return jsonify(get_email_details(email_id))

if __name__ == "__main__":
    app.run(debug=True)
