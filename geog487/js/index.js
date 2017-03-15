var lastMarker = undefined;
var map = undefined;

$( document ).ready(function() {
    map = createMap();
    addBasemap();
    getDataAjax();
    bindMapActions();
    bindSubmit();
});

var createMap = function () {
	var mymap = L.map('mapid').setView([43.470713, -80.5430], 15);
	return mymap;
}

//adds openstreet basemap to map
var addBasemap = function () {
	var basemap = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
		attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
}

var submitMakeAjax = function () {
	var lat = $('#lat').val().trim(" ");
	var lng = $('#lng').val().trim(" ");
	var desc = $('#desc').val().trim(" ");
	var cat = $('#cat >option:selected').val().trim(" ");

	if (lat === "" || lng === "" || desc === "" || cat === "") {
		buttonReady();
		$('#gif').html('<div id="loading-error">Provide a value for all fields.</div>');
		return
	} else {
		var data = JSON.stringify({
				"lat": lat,
				"lng": lng,
				"description": desc,
				"category": cat
			});

		$.ajax({
			type: 'POST',
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			//url: "http://localhost:8082/hazards",
			url: "http://52.14.152.176:8082/hazards",
			data: data
		}).done(function(msg) {
			getDataAjax();
			console.log('request finished');
		}).fail(function(msg) {
			console.log('request failed');
		}).always(function(msg) {
			clearValues();
			buttonReady();
		});
	}
}

var redrawPoints = function (data) {
	var point = {
		"type":"Feature",
		"properties":{

		},
		"geometry":{
			"type":"Point",
			"coordinates":[]
		}
	}
	var allPoints = []

	data.data.forEach(function(element) {
		var temp = $.extend( true, {}, point );
		//console.log(temp);
		temp.properties.description = element.description;
		temp.properties.category = element.type;
		temp.geometry.coordinates.push(element.lng);
		temp.geometry.coordinates.push(element.lat);

		allPoints.push(temp);
	});
	var styleOptions = {
		    radius: 5,
		    fillColor: "#000000",
		    color: "#000",
		    weight: 0.5,
		    opacity: 1,
		    fillOpacity: 0.9
		};
	var pointsOnMap = L.geoJson(allPoints, {
		    pointToLayer: function (feature, latlng) {
		        return L.circleMarker(latlng, styleOptions);
		    },
		    onEachFeature: applyProperties
		}).addTo(map);
}

var getDataAjax = function () {
	var data = $.ajax({
		type: 'GET',
		dataType: "json",
		//url: "http://localhost:8082/hazards"
		url: "http://52.14.152.176:8082/hazards"
	}).done(function(msg) {
		redrawPoints(msg);
	}).fail(function(msg) {
		console.log("error retrieving data");
	})
}

var buttonReady = function () {
	setTimeout(function () {
		$('#loading-img').remove();
		$('#submit-button').css('pointer-events', '');
	}, 100);
}

var buttonLoading = function () {
	$('#submit-button').css('pointer-events', 'none');
	$('#gif').html('<img id="loading-img" src="res/img/loading.gif">');
}

var clearValues = function () {
	$('#lat').val('');
	$('#lng').val('');
	$('#desc').val('');
}

var bindSubmit = function () {
	$('#submit-button').click(function () {
		buttonLoading();
		submitMakeAjax();
	});
}

var bindMapActions = function () {
	map.on('click', function(e) {

		$('#lat').val(e.latlng.lat.toFixed(5));
		$('#lng').val(e.latlng.lng.toFixed(5));

		try {
			map.removeLayer(lastMarker);
		} catch (ignore) {}

		var marker = new L.marker([e.latlng.lat, e.latlng.lng]);
		lastMarker = marker;
		lastMarker.addTo(map);
	});
}

var addPoints = function (map) {
	removeAllPoints();
	var styleOptions = {
	    radius: 5,
	    fillColor: "#000000",
	    color: "#000",
	    weight: 0.5,
	    opacity: 1,
	    fillOpacity: 0.9
	};
	var pointsOnMap = L.geoJson(pointsJSON, {
	    pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, styleOptions);
	    }
	}).addTo(map);
}

var removeAllPoints = function () {
	map.eachLayer(function (layer) {
		try {
	    	if (layer.feature.geometry.type === "Point") {
				console.log("point");
	    	}
	    } catch (ignore) {}
	});
}

var applyProperties = function (feature, layer) {
	var style = {
		"blocked sidewalk": "rgb(81, 201, 121)",
		"steep slope": "rgb(252, 10, 10)",
		"no sidewalk slab": "rgb(153, 146, 81)",
		"trip hazard": "rgb(211, 245, 88)",
		"other": "rgb(173, 94, 148)"
	}
	if (feature.properties) {
		var newStyle = {
			fillColor: ""
		}
		newStyle['fillColor'] = style[feature.properties.category];

		layer.bindPopup(feature.properties.description);
		layer.setStyle(newStyle);
	}
}
