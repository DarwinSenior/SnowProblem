var user = {
	to   : "zh-CN",
	from : "zh-CN",
	on   : null,
}

var snowyFace = [
	"1.jpg",
	"2.jpg",
	"3.jpg",
	"5.jpg",
	"7.jpg",
	"image_139.jpg",
	"image_153.jpg",
	"image_166.jpg",
	"image_180.jpg",
	"image_192.jpg",
	"image_205.jpg",
	"image_218.jpg",
	"image_231.jpg",
	"image_245.jpg",
	"image_260.jpg",
	"image_275.jpg",
	"image_290.jpg",
	"image_305.jpg",
	"image_320.jpg",
	"image_335.jpg",
	"image_347.jpg",
	"image_427.jpg",
	"image_428.jpg",
	"image_558.jpg",
];

function randFace() {
	var rand = Math.floor(Math.random()*snowyFace.length) + 1;
	return snowyFace[rand];
}

function changeFace(src){
	$("#face").load("/img/"+src+".jpg");
}

var bot = [{
	baseLang : "en-US",
	baseUrl : "http://www.cleverbot.com/webservicemin?",
	addUrl : "start=y&sessionid=&icognoid=wsf&icognocheck=f5aa460e6dc7b9bfdda68740cb8e1aaf&prevref=&emotionaloutput=&emotionalhistory=&asbotname=&ttsvoice=&typing=&tweak1=-1&tweak2=-1&tweak3=-1&lineref=&sub=Say&islearning=1&cleanslate=false",

	getUrl : function(query) {
		var pageLang = user.from.substring(0,2);
		var url = this.baseUrl +
				  this.addUrl +
				  "&stimulus=" + encodeURIComponent(query);
		for (var i=2; i<go.responses.length && i<9; i++) {
			var str = go.responses[i-1] || "";
			url += "&vText" + i + "=" + encodeURIComponent(str);
		}
		url += "&fno=0";
		return url;
	},

	getMessage : function(xml) {
		var cut1 = xml.substr(0, xml.lastIndexOf("</message>"));
		var cut2 = cut1.substr(cut1.lastIndexOf("<message>") + "<message>".length);
		return cut2;
	},

	fetch : function(query, fn) {
		var url = this.getUrl(query);
		callUrl(url, true, fn);
	},
},{
	baseLang : "en-US",
	baseUrl : "http://sheepridge.pandorabots.com/pandora/talk?botid=b69b8d517e345aba&skin=custom_input",
},{
	baseLang : "en-US",
	baseUrl : "http://www.botlibre.com/rest/botlibre/form-chat?instance=165&application=8821025394976658259&message=",

	getUrl : function(query) {
		var url = this.baseUrl +
				  query;
		return url;
	},

	getMessage : function(xml) {
		var cut1 = xml.substr(0, xml.lastIndexOf("</message>"));
		var cut2 = cut1.substr(cut1.lastIndexOf("<message>") + "<message>".length);
		return cut2;
	},

	fetch : function(query, fn) {
		var url = this.getUrl(query);
		callUrl(url, true, fn);
	},
},{
}];

var go = {
	responses : [],
	translateBox : function() {
		var textbox = html.textbox("Word to Translate");
		textbox.id = "instantTranslation";
		popupForm.getSelectedWord();
		html.addEnterKey(textbox, function() {
			var text = textbox.value;
			if (text) {
				var lang = document.getElementById("langSwitch").show;
				if (lang == user.from) {
					popupForm.translateTwoWaySave(text);
				}
				else if (lang == user.to) {
					popupForm.translateShow(text);
				}
			}
		});
		return textbox;
	},

	beginChain : function() {
		if (user.on !== false) {
			console.log("Listening");
			go.triggerPage();
		}
	},

	triggerPage : function() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {trigger: true, lang: user.from});
		});
	},

	voiceRecognizedHandler : function(text) {
		go.responses.push(text);
		labelFrom.innerText = text;
		if (user.to === bot[botNum].baseLang) {
			go.sendChatBotRequest(text);
		}
		else {
			go.translateFrom(text);
		}
	},

	translateFrom : function(text) {
		googleTranslate.translateOptions(text, {
			input : "from",
			type : "noDef",
			examples : true,
			handler : go.handleSendTranslation,
		});
	},

	handleSendTranslation : function(res) {
		console.log(res);
		var text = go.getToWords(res)[0][0];
		labelTo.innerText = text;
		snowy.src = randFace();
		go.sendChatBotRequest(text);
	},

	sendChatBotRequest : function(text) {
		bot[botNum].fetch(text, go.handleChatReceive);
	},

	handleChatReceive : function(res) {
		var text = bot[botNum].getMessage(res);
		go.responses.push(text);
		labelToBack.innerText = text;
		if (user.to === bot[botNum].baseLang) {
			go.speakResult(text);
		}
		else {
			go.translateTo(text);
		}
	},

	translateTo : function(text) {
		googleTranslate.translateOptions(text, {
			input : "to",
			type : "noDef",
			examples : true,
			handler : go.handleRecieveTranslation,
		});
	},

	handleRecieveTranslation : function(res) {
		console.log(res);
		var text = go.getFromWords(res)[0][0];
		labelFromBack.innerText = text;
		snowy.src = randFace();
		go.speakResult(text);
	},

	speakResult : function(text) {
		speak(text, user.to, go.backgroundCallback);
	},

	getToWords : function(list) {
		var toWords = [];
		for (var i=0; i < list.length; i++) {
			toWords.push(list[i].t);
		}
		return toWords;
	},

	getFromWords : function(list) {
		var fromWords = [];
		for (var i=0; i < list.length; i++) {
			fromWords.push(list[i].f);
		}
		return fromWords;
	},

	backgroundCallback : function(res) {
		console.log(res);
		if (res.end) {
			go.beginChain();
		}
	},
}

function speak(text, lang, fn) {
	fn = fn || function(){};
	lang = lang || user.to;
	console.log(lang);
	chrome.runtime.sendMessage({
		type : "tts",
		text : text,
		lang : lang,
	}, fn);
}

chrome.runtime.onMessage.addListener(
	function(req) {
		console.log(req);
		if (req.res) {
			console.log(req.res);
			go.voiceRecognizedHandler(req.res);
		}
		if (req.end) {
			go.beginChain();
		}
	}
);

function snowyMap() {
	// var map = document.createElement('map');
	// var area = document.createElement('area');
	// area.shape = 'rect';
	// area.coords = '0,0,50,50';
	// area.href = "http://www.google.com";
	// return map;
	var obj = html.obj();
	var str = '<map name="map"><area shape="rect" coords="0,0,50,50" href="http://www.google.com"></map>';
	obj.outerHTML = str;
	return obj;
}

function swap() {
	user.on = !user.on;
	if (user.on) {
		snowy.src = randFace();
	}
	else {
		snowy.src = snowyFace[0];
	}
}

var snowy;
var botNum = 2;
function test() {
	snowy = html.image(res('img/1.jpg'));
	snowy.style.height = '100%';
	snowy.style.width = '100%';
	snowy.onclick = function() {
		swap();
		go.beginChain();
	};

	document.body.appendChild(snowy);
	document.body.appendChild(html.br());
	document.body.appendChild(labelFrom);
	document.body.appendChild(html.br());
	document.body.appendChild(labelFromBack);
	document.body.appendChild(html.br());
	document.body.appendChild(labelTo);
	document.body.appendChild(html.br());
	document.body.appendChild(labelToBack);
	// snowy.usemap = snowyMap();
	// snowy.usemap = "#map";
	// snowyMap();
}
