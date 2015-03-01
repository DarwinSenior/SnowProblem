var googleTranslate = {
	baseUrl : "http://translate.google.com/",
	urlFormat : "translate_a/t?client=t&hl=en&ie=UTF-8&oe=UTF-8&multires=1&otf=1&pc=1&trs=1&ssel=3&tsel=6&sc=1",
	urlExample : "translate_a/single?client=t&hl=en&dt=bd&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&prev=bh&ssel=0&tsel=0&tk=517566|1030260",
	defOptions : {
		input     : "to",     // Original words language
		type      : "noDef",  // (def or noDef) for input has definitions
		examples  : true,     // Download example sentences?
		handler   : "append", // (append, replace, or custom function)
		delimit   : "lines",  // Type of delimiting if any
		translate : true,     // Use translation or not
	},
	options : {},

	getLink : function(query) {
		var url = googleTranslate.baseUrl +
				  "#" +
				  user.to   + "/" +
				  user.from + "/" +
				  query;
		return url;
	},

	formBasicUrl : function(text, from, to) {
		var url = googleTranslate.baseUrl +
		          googleTranslate.urlFormat +
				  "&text=" + text +
				  "&sl="   + from +
				  "&tl="   + to   ;
		return url;
	},

	formExampleUrl : function(text, from, to) {
		var url = googleTranslate.baseUrl +
		          googleTranslate.urlExample +
				  "&q="  + text +
				  "&sl=" + from +
				  "&tl=" + to   ;
		return url;
	},

	// This encodes the message so that Google will translate multiple sentences
	encodeMessage : function(text) {
		text = text.replace("\.", "。")
				   .replace("\?", "？")
				   .replace("\!", "！")
				   .replace("\;", "；");
		return text;
	},

	// This decodes the message so that Google will translate multiple sentences
	decodeMessage : function(text) {
		text = text.replace("。", "\.")
				   .replace("？", "\?")
				   .replace("！", "\!")
				   .replace("；", "\;");
		return text;
	},

	parseResponse : function(res) {
		res = res.replace(/(\\u003cb\\u003e)|(\\u003c\/b\\u003e)/g, "");
		res = res.replace(/,(?=,)/g, ',""');
		res = res.replace(/\[,/g, '["",');
		res = res.replace(/,\]/g, ',""]');
//		res = res.replace(/'|\\'/g, "\\'");
		return JSON.parse(res);
	},

	parseGetOriginalWord : function(json) {
		return json[0][0][1];
	},

	parseGetTranslation : function(json) {
		// TODO: Convert to object instead of array
		var list = [];
		list.push(json[0][0][0].toLowerCase());
		if (json[4] && json[4][0] && json[4][0][0] && json[4][0][4] > 0) {
			var word = json[4][0][0].toLowerCase();
			if (list.indexOf(word) === -1) {
				list.push(word);
			}
		}
		if (json[5] && json[5][0] && json[5][0][2].length) {
			for (var i=0; i < json[5][0][2].length; i++) {
				var word = json[5][0][2][i][0].toLowerCase();
				var stat = json[5][0][2][i][1];
				if (stat > 0 && list.indexOf(word) === -1) {
					list.push(word);
				}
			}
		}
		return list;
	},

	parseGetFromPronunciation : function(json) {
		var word = "";
		if (json[0] && json[0][1] && json[0][1][3]) {
			word = json[0][1][3];
		}
		else if (json[0] && json[0][0] && json[0][0][3]){
			word = json[0][0][3];
		}
		return word;
	},

	parseGetToPronunciation : function(json) {
		var word = "";
		if (json[0] && json[0][1] && json[0][1][2]) {
			word = json[0][1][2];
		}
		else if (json[0] && json[0][0] && json[0][0][2]){
			word = json[0][0][2];
		}
		return word;
	},

	parseGetSynonyms : function(json) {
		var list = [];
		if (json[1] && json[1][0] && json[1][0][2]) {
			for (var i=0; i < json[1].length; i++) {
				if (json[1][i][2] && json[1][i][2]) {
					for (var j=0; j < json[1][i][2].length; j++) {
						if (json[1][i][2][j][1]) {
							for (var k=0; k < json[1][i][2][j][1].length; k++) {
								var word = json[1][i][2][j][1][k].toLowerCase();
								if (list.indexOf(word) === -1) {
									list.push(word);
								}
							}
						}
					}
				}
			}
		}
		return list;
	},

	parseGetSynonymsGood : function(json, words) {
		var list = [];
		if (json[1] && json[1][0] && json[1][0][2]) {
			for (var i=0; i < json[1].length; i++) {
				if (json[1][i][2] && json[1][i][2]) {
					for (var j=0; j < json[1][i][2].length; j++) {
						if (json[1][i][2][j][1] && words.indexOf(json[1][i][2][j][0].toLowerCase()) !== -1) {
							for (var k=0; k < json[1][i][2][j][1].length; k++) {
								var word = json[1][i][2][j][1][k].toLowerCase();
								if (list.indexOf(word) === -1) {
									list.push(word);
								}
							}
						}
					}
				}
			}
		}
		return list;
	},

	getAllTranslations : function(json) {
		var results = [];
		for (var i=0; i<json[5][0].length; i++) {
			var array = json[5][0][i];
			var translation = array[0].toLowerCase();
			var prob = array[1];
			if (prob > 0 && results.indexOf(translation) === -1 && googleTranslate.isValidWord(translation)) {
				array.push(translation);
			}
		}
		return results;
	},

	isValidWord : function(json) {
		var valid = translation.indexOf("...") === -1 
		         && translation.indexOf("-") !== 0
		         && translation.indexOf("-") !== translation.length - 1
				 && translation != word;
	},

	parseGetExampleSentences : function(json) {
		var list = [];
		if (json[13] && json[13][0]) {
			for (var i=0; i<json[13][0].length; i++) {
				list.push(json[13][0][i][0]);
			}
		}
		return list;
	},

	parseGetExampleContext : function(json) {
		var list = [];
		if (json[14] && json[14][0]) {
			for (var i=0; i<json[14][0].length; i++) {
				list.push(json[14][0][i]);
			}
		}
		return list;
	},

	// TODO: Remove
	handleDelimitingWordsAndDefinitions : function(text) {
		var json = googleTranslate.parseResponse(text);
		var tran = googleTranslate.parseGetTranslation(json);
		var word = googleTranslate.parseGetOriginalWord(json);
		var syn  = googleTranslate.parseGetSynonyms(json);
		var syno = googleTranslate.parseGetSynonymsGood(json, tran);
		var sent = googleTranslate.parseGetExampleSentences(json);
		var exam = googleTranslate.parseGetExampleContext(json);
		var proF = googleTranslate.parseGetFromPronunciation(json);
		var proT = googleTranslate.parseGetToPronunciation(json);
	},

	delimitOnly : function(text, delimit, handler) {
		googleTranslate.translateOptions(textbox.value, {
			handler  : handler,
			delimit  : delimit,
			translate: false,
		});
	},

	addToList : function(text) {
		var json = googleTranslate.parseResponse(text);
		var word = {
			f : googleTranslate.parseGetTranslation(json),
			t : googleTranslate.parseGetOriginalWord(json),
			p : googleTranslate.parseGetFromPronunciation(json),
		};
		if (googleTranslate.getInputLanguage() == "from") {
			var word = {
				f : googleTranslate.parseGetOriginalWord(json),
				t : googleTranslate.parseGetTranslation(json),
				p : googleTranslate.parseGetToPronunciation(json),
			};
		}
		googleTranslate.list.push(word);
//		fileManagement.appendFile([word]);
	},

	handleOptions : function(req) {
		if (req.readyState == 4 && req.status == 200) {
			var res = req.responseText;
			googleTranslate.addToList(res);
			googleTranslate.remain--;
		}
		else if (req.readyState == 4 && req.status == 404) {
			googleTranslate.remain--;
		}
		if (googleTranslate.count === googleTranslate.total && googleTranslate.remain === 0) {
			var handler = googleTranslate.getHandler();
			var list = googleTranslate.list;
			googleTranslate.list = [];
			googleTranslate.endTranslation();
			handler(list);
		}
	},

	translateOptions : function(words, options) {
		if (!googleTranslate.busy) {
			googleTranslate.busy   = true;
			googleTranslate.list   = [];
			googleTranslate.remain = 0;
			googleTranslate.count = 0;
			googleTranslate.options = options || googleTranslate.defOptions;
			if (fn = googleTranslate.getDelimit()) {
				var res = fn(words);
				words = parse.getToWords(res);
			}
			if (typeof words == "string") {
				words = [words];
			}
			googleTranslate.total = words.length;
			if (googleTranslate.getTranslate()) {
				googleTranslate.translateMultiOptions(words);
			}
			else {
				googleTranslate.getHandler()(res);
				googleTranslate.busy = false;
			}
		}
	},

	translateMultiOptions : function(words) {
		for (var i=0; i < words.length; i++) {
			googleTranslate.translateSingleOption(words[i]);
		}
		googleTranslate.busy = true;
	},

	translateSingleOption : function(word) {
		var fn = googleTranslate.handleOptions;
		var text = googleTranslate.encodeMessage(word);
		var from = user.from;
		var to   = user.to;
		if (googleTranslate.getInputLanguage() == "to") {
			from = user.to;
			to   = user.from;
		}
		var url  = googleTranslate.getUrl()(text, from, to);
		googleTranslate.remain += 1;
		googleTranslate.count  += 1;
		//callUrlFull(url, true, fn);
	},

	endTranslation : function() {
		googleTranslate.options = {};
		googleTranslate.busy = false;
		googleTranslate.list = [];
	},

	getHandler : function() {
		var handler = googleTranslate.options.handler;
		if (typeof handler === "string") {
			if (handler === "append") {
				return fileManagement.appendFile;
			}
			else if (handler === "replace") {
				return fileManagement.replaceFile;
			}
		}
		else if (typeof handler === "function") {
			return handler;
		}
		else {
			return function(){};
		}
	},

	getUrl : function() {
		var url = googleTranslate.options.examples;
		if (googleTranslate.options.examples) {
			return googleTranslate.formExampleUrl;
		}
		else {
			return googleTranslate.formBasicUrl;
		}
	},

	// TODO: Finish, decide to use translation or not
	getType : function() {

	},

	getDelimit : function() {
		if (googleTranslate.options.delimit === "lines") {
			return parse.lineDelimiter;
		}
		else if (typeof googleTranslate.options.delimit === "function") {
			return googleTranslate.options.delimit;
		}
		else {
			return false;
		}
	},

	getTranslate : function() {
		if (googleTranslate.options.translate === false) {
			return false;
		}
		else {
			return true;
		}
	},

	getInputLanguage : function() {
		if (googleTranslate.options.input == "from") {
			return "from";
		}
		else {
			return "to";
		}
	},
}

var googleImages = {
	baseUrl : "https://ajax.googleapis.com/",
	urlSearch : "ajax/services/search/",
	urlImages : "images?v=1.0",

	fetchImages : function(query, line, fn) {
		fn = fn || googleImages.handleImages;
		var url = googleImages.formImageUrl(query);
		callUrl(url, true, function(res) {
			fn(res, line);
		});
	},

	fetchImagesLine : function(line, fn) {
		fn = fn || googleImages.handleImages;
		var url = googleImages.formImageUrl(preload.file[line].to);
		callUrl(url, true, function(res) {
			fn(res, line);
		});
	},

	formImageUrl : function(query) {
		var url = googleImages.baseUrl +
		          googleImages.urlSearch +
		          googleImages.urlImages +
				  "&q=" + query;
		return url;
	},

	imageResults : function(json, num) {
		num = num || 0;
		var data = json.responseData;
		var results = data.results;
		if (num >= 0) {
			return results[num];
		}
		return results;
	},

	imageUrl : function(image) {
		return image.tbUrl;
	},

	handleImages : function(res, line) {
		var json = JSON.parse(res);
		if (json.responseStatus == 200) {
			var image = googleImages.imageResults(json, 0);
			var url = googleImages.imageUrl(image);
			if (!preload.file[line].image) {
				preload.file[line].image = url;
			}
		}
	},
}