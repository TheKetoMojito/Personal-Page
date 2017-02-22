var activeButton = "home";

$( document ).ready(function() {
	$("#insertable").load("../html/include/home.html");
    main();
});


var main = function() {
	var buttons = ["home", "resume", "projects"];
	darkenActiveButton(buttons);
	setOnHover(buttons);
	setOnClick(buttons);
}	

var lightenAllButtons = function(buttons) {
	buttons.forEach(function(button) {
		lightenButton(button);
	});
}

var lightenButton = function(button) {
	$("#" + button).css("color", "rgb(183, 183, 183)");
}

var darkenButton = function(button) {
	$("#" + button).css("color", "black");
}

var darkenActiveButton = function() {
	darkenButton(activeButton);
}

var setOnHover = function(buttons) {
	buttons.forEach(function(button) {
		$("#" + button).mouseover(function(){
			darkenButton(button);
		});
		$("#" + button).mouseout(function(){
			lightenAllButtons(buttons);
			darkenActiveButton();
		});
	});
}

var setOnClick = function(buttons) {
	buttons.forEach(function(button) {
		$("#" + button).click(function(){
            $("#insertable").load("../html/include/" + button + ".html");
			activeButton = button;
			lightenAllButtons(buttons);
			darkenActiveButton();
		});
	});
}