var dictation = {
	getlang : function (opt) {
	    var langs = [
	        ["Afrikaans", "af-za", "--", "en-us"],
	        ["Bahasa Indonesia", "id-id", "--", "id-id"],
	        ["Bahasa Melayu", "ms-my", "--", "ms-my"],
	        ["Català", "ca-es", "--", "ca-es"],
	        ["Čeština", "cs-cz", "--", "cs-cz"],
	        ["Deutsch", "de-de", "--", "de-de"],
	        ["Australia", "en-au", "English", "en-gb"],
	        ["Canada", "en-ca", "English", "en-us"],
	        ["India", "en-in", "English", "en-gb"],
	        ["New Zealand", "en-nz", "English", "en-gb"],
	        ["South Africa", "en-za", "English", "en-gb"],
	        ["United Kingdom", "en-gb", "English", "en-gb"],
	        ["United States", "en-us", "English", "en-us"],
	        ["Argentina", "es-ar", "Español", "es-419"],
	        ["Bolivia", "es-bo", "Español", "es-419"],
	        ["Chile", "es-cl", "Español", "es-419"],
	        ["Colombia", "es-co", "Español", "es-419"],
	        ["Costa Rica", "es-cr", "Español", "es-419"],
	        ["Ecuador", "es-ec", "Español", "es-419"],
	        ["El Salvador", "es-sv", "Español", "es-419"],
	        ["España", "es-es", "Español", "es"],
	        ["Estados Unidos", "es-us", "Español", "es-419"],
	        ["Guatemala", "es-gt", "Español", "es-419"],
	        ["Honduras", "es-hn", "Español", "es-419"],
	        ["México", "es-mx", "Español", "es-419"],
	        ["Nicaragua", "es-ni", "Español", "es-419"],
	        ["Panamá", "es-pa", "Español", "es-419"],
	        ["Paraguay", "es-py", "Español", "es-419"],
	        ["Perú", "es-pe", "Español", "es-419"],
	        ["Puerto Rico", "es-pr", "Español", "es-419"],
	        ["Rep. Dominicana", "es-do", "Español", "es-419"],
	        ["Uruguay", "es-uy", "Español", "es-419"],
	        ["Venezuela", "es-ve", "Español", "es-419"],
	        ["Euskara", "eu-es", "--", "en-us"],
	        ["Français", "fr-fr", "--", "fr"],
	        ["Galego", "gl-es", "--", "en-us"],
	        ["IsiZulu", "zu-za", "--", "en-us"],
	        ["Íslenska", "is-is", "--", "en-us"],
	        ["Italiano Italia", "it-it", "Italiano", "it"],
	        ["Italiano Svizzera", "it-ch", "Italiano", "it"],
	        ["Magyar", "hu-hu", "--", "hu"],
	        ["Nederlands", "nl-nl", "--", "nl"],
	        ["Polski", "pl-pl", "--", "pl"],
	        ["Brasil", "pt-br", "Português", "pt-br"],
	        ["Portugal", "pt-pt", "Português", "pt-pt"],
	        ["Română", "ro-ro", "--", "ro"],
	        ["Slovenčina", "sk-sk", "--", "sk"],
	        ["Suomi", "fi-fi", "--", "fi"],
	        ["Svenska", "sv-se", "--", "sv"],
	        ["Türkçe", "tr-tr", "--", "tr"],
	        ["български", "bg-bg", "--", "bg"],
	        ["Pусский", "ru-ru", "--", "ru"],
	        ["Српски", "sr-rs", "--", "sr"],
	        ["한국어", "ko-kr", "--", "ko"],
	        ["普通话 (中国大陆)", "cmn-hans-cn", "中文", "zh-cn"],
	        ["普通话 (香港)", "cmn-hans-hk", "中文", "zh-cn"],
	        ["中文 (台灣)", "cmn-hant-tw", "中文", "zh-tw"],
	        ["粵語 (香港)", "yue-hant-hk", "中文", "zh-cn"],
	        ["日本語", "ja-jp", "--", "ja"],
	        ["Lingua latīna", "la", "--", "es-419"]
	    ];
	    return langs[opt][1];
	},
	init: function() {
	    dictation.speech = new webkitSpeechRecognition();
	    dictation.speech.continuous = false;
	    dictation.speech.maxAlternatives = 10;
	    dictation.speech.interimResults = false;

	    // dictation.speech.lang = ["United States", "en-us", "English", "en-us"];
	    dictation.speech.onend = dictation.end;
	    dictation.speech.onresult = dictation.update;
	    dictation.speech.onerror = function(event) { console.log(event); };

	},

	start: function(event){
		console.log("restart");
		dictation.speech.start();
	},

	update: function(event){
		var intermin_transcript = "";
		var final_transcript = "";
		for (var i=event.resultIndex; i<event.results.length; i++){
			if (event.results[i].isFinal){
				final_transcript += event.results[i][0].transcript;
			}else{
				intermin_transcript += event.results[i][0].transcript;
			}
		}
		var pre_script = $("#final_transcript").text();
		$("#final_transcript").text(pre_script+final_transcript);
		console.log(intermin_transcript);
		$("#intermin_transcript").text(intermin_transcript);
	},

	end: function(){
		console.log("hello");
		sms.sendReuqest($("#intermin_transcript").text()+$("#final_transcript").text());
		$("#intermin_transcript").text("");
		$("#final_transcript").text("");
	}
};

dictation.init();