var buttonState = {
	buttons : ["home", "resume", "projects"],
	activeButton : "home"
}

$( document ).ready(function() {
	$("#insertable").load("../html/include/home.html");
    main();
});

var main = function() {
	darkenActiveButton();
	setOnHover(buttonState.buttons);
	setOnClick(buttonState.buttons);
}

var lightenButton = function(button) {
	$("#" + button).css("color", "rgb(183, 183, 183)");
}

var darkenButton = function(button) {
	$("#" + button).css("color", "black");
}

var darkenActiveButton = function() {
	darkenButton(buttonState.activeButton);
}

var lightenAllButtons = function(buttons) {
	buttons.forEach(function(button) {
		lightenButton(button);
	});
}

var setOnHover = function(buttons) {
	buttons.forEach(function(button) {
		$("#" + button).mouseover(function(){
			darkenButton(button);
		});
		$("#" + button).mouseout(function(){
			if (buttonState.activeButton != button) {
				lightenButton(button);
			}
		});
	});
}

var setOnClick = function(buttons) {
	buttons.forEach(function(button) {
		$("#" + button).click(function(){
            $("#insertable").load("../html/include/" + button + ".html");

			lightenAllButtons(buttons);
			buttonState.activeButton = button;
			darkenActiveButton();
		});
	});
}