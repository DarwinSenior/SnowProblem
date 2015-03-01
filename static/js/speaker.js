var speaker = {
	speak : function(text, language, cb){
		msg = new SpeechSynthesisUtterance();
		msg.voiceURI = 'native';
		msg.rate = 1;
		msg.pitch = 2;
		msg.text = text;
		msg.lang = language || 'en-GB';
		msg.onend = cb;
		speechSynthesis.speak(msg);
	}
};