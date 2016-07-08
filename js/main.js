// initialize EmailJS plugin
emailjs.init("user_9XlP21UFyEIGPFx7mKChn");
$("input, textarea").on("keyup", function(e) {
	$(this).css("border-bottom", "2px solid #049DBF");
	$(this).next().hide();
});

$("input").on("blur", function(e) {
	// unhighlight input field
	$(this).css("border-bottom", "2px solid #B2B2B2");
});

$("input").on("focus", function(e) {
	// highlight input field
	$(this).css("border-bottom", "2px solid #049DBF");
});

$("#send").on("click", function(e) {
    NProgress.start();
    var from_name = $("#from-name").val();
    var email = $("#from-email").val();
    var message = $("#from-message").val();

    if(validFields(from_name, email, message)) {
    	sendEmail(from_name, email, message);
    } else {
    	// show errors
    	showErrors();
    }
  });

function validFields(name, email, message) {
	if(name.length === 0) {
		$("#from-name").css("border-bottom", "2px solid #c40022");
		$("#from-name-error").show();
	} else {
		$("#from-name-error").hide();
	}

	if(email.length === 0) {
		$("#from-email").css("border-bottom", "2px solid #c40022");
		$("#from-email-error").show();
	} else {
		$("#from-email-error").hide();
	}

	if(message.length === 0) {
		$("#from-message").css("border-bottom", "2px solid #c40022");
		$("#from-message-error").show();
	} else  {
		$("#from-message-error").hide();
	}
	return false;
}

function showErrors() {
	NProgress.done();
	console.log("Errors found");
}

function sendEmail(from_name, contact_email, message) {
	emailjs.send("yahoo1453","template_vqIpQ2sP", {from_name: from_name, contact_email: contact_email, message_html: message})
		.then(function(response) {
	   console.log("SUCCESS. status=%d, text=%s", response.status, response.text);
	   NProgress.done();
	}, function(err) {
	   console.log("FAILED. error=", err);
	});

	console.log("Dirk");
};

(function() {
	var textarea = document.querySelector('textarea');

	textarea.addEventListener('keydown', autosize);
	             
	function autosize(){
	  var el = this;
	  el.style.cssText = 'height:auto; padding:0';
    // for box-sizing other than "content-box" use:
    // el.style.cssText = '-moz-box-sizing:content-box';
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
	}
})();
