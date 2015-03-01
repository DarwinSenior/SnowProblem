from flask import Flask
app = Flask(__name__)

import goslate

gs = goslate.Goslate();

@app.route("/<sentence>")
def hello(sentence):
    return gs.translate(sentence, 'zh')


if __name__ == '__main__':
	app.debug = True
	app.run("0.0.0.0", port="4001")