from flask import Flask, request, send_from_directory,render_template
from OpenSSL import SSL
from chatterbot import ChatBot
from cleverbot import Cleverbot

import goslate

app = Flask(__name__)

# context = SSL.Context(SSL.SSLv23_METHOD)
# context.use_privatekey_file('./server.key')
# context.use_certificate_file('./server.crt')

gs = goslate.Goslate();

chatbot = ChatBot()
cb = Cleverbot()

chatbot.log_directory="./chatbot"

@app.route("/translate/<lang>/<sentence>")
def translate(lang, sentence):
    return gs.translate(sentence, lang)

@app.route("/chatbot/<conversation>")
def chat(conversation):
	try:
		response = cb.ask(conversation)
	except Exception, e:
		response = chatbot.get_response(conversation)
	return response or " "

@app.route('/')
def index():
	return render_template("index.html")

# @app.route('/<path>')
# def staticFiles(path):
# 	print path
# 	return app.send_static_file("static/"+path)




if __name__ == '__main__':
	app.debug = True
	app.run("0.0.0.0", port=4001, ssl_context="adhoc")