var user = {
	to   : "zh-CN",
	from : "zh-CN",
	on   : null,
}


var sms={
	init : function(){
		$("#send").click(sms.sendText);
		$("#text-input").keyup(function(event) {
			if (event.keyCode==13) {
				sms.sendText($("#text-input").val());
			};
		});
		sms.changeFace();
		sms.focusAll();
		sms.speech = "";
	},

	sendReuqest: function(txt){
		if (txt!=""){
			sms.sendText(txt);
			sms.translate(txt, sms.sendText);
			var receiveTextWithTranslation = function(text){
				sms.receiveText(text);
				sms.translate(text, 
					function(tranlated){
						sms.receiveText(tranlated);
						speaker.speak(text, "en-GB", function(){
							speaker.speak(tranlated, 'zh-CN', dictation.start());
						});
					});
			} 
			sms.chatbot(txt, receiveTextWithTranslation);
		}else{
			dictation.start();
		}
	},

	scrollToButtom: function(){
		var div = $(".middle")[0];
		div.scrollTop = div.scrollHeight;
	},

	focusAll: function(){
		$("body").click(function(){
			if (!$("#text-input").is(":focus")) {
	        	$("#text-input").focus(); 
	    	}
		});
	},

	testInput: function(){
		sms.sendReuqest($("#final_transcript").text());
	},

	snowyFace : [
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
	],

	changeFace: function(){
		var rand = Math.floor(Math.random()*sms.snowyFace.length) + 1;
		var randimg = $("#face>img:nth-child("+rand+")");
		randimg.show();
		randimg.siblings().hide();
	},

	translate: function(txt, cb){
		$.ajax({
			method: "GET",
			url: encodeURI("/translate/zh/"+txt),// to change later 
		}).success(cb);
	},

	chatbot: function(txt, cb){
		$.ajax({
			method : "GET",
			url: encodeURI("/chatbot/"+txt)
		}).success(cb);
	},

	sendText: function(txt){
		var newThemText = $('<li class="me"><blockquote>'+txt+'</blockquote></li>');
		$(".chat").append(newThemText);
		sms.scrollToButtom();
		sms.changeFace();
	},

	receiveText: function(txt){
		var newThemText = $('<li class="them"><blockquote>'+txt+'</blockquote></li>');
		$(".chat").append(newThemText);
		sms.scrollToButtom();
		sms.changeFace();
	},
}