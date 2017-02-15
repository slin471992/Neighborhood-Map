// MODEL
var locations = [
	{
		name: "The Houston Museum of Natural Science",
		coordinates: {lat: 29.721599, lng: -95.389261},
		category: "science"
	},
	{
		name: "Museum of Fine Arts, Houston",
		coordinates: {lat: 29.725680, lng: -95.390482},
		category: "art"
	},
	{
		name: "Contemporary Arts Museum Houston",
		coordinates: {lat:29.726392, lng:-95.391507},
		category: "art"
	},
	{
		name:"The Menil Collection",
		coordinates: {lat: 29.737185, lng: -95.397685},
		category: "art"
	},
	{
		name:"Houston Museum-African American Culture",
		coordinates: {lat: 29.729542, lng: -95.382413},
		category: "culture"
	},
	{
		name: "Houston Center for Contemporary Craft",
		coordinates: {lat: 29.730720, lng: -95.386103},
		category: "art"
	},
	{
		name: "Holocaust Museum Houston",
		coordinates: {lat: 29.725129, lng: -95.385634},
		category: "other"
	},
	{
		name: "Lawndale Art Center",
		coordinates: {lat: 29.729910, lng: -95.386646},
		category: "art"
	},
	{
		name: "The Health Museum",
		coordinates: {lat: 29.721709, lng: -95.385996},
		category: "science"
	},
	{
		name: "Houston Center For Photography",
		coordinates: {lat: 29.738372, lng: -95.397252},
		category: "art"
	},
	{
		name: "The Houston Fire Museum",
		coordinates: {lat: 29.747399, lng: -95.374803},
		category: "other"
	},
	{
		name: "Czech Center Museum",
		coordinates: {lat: 29.728961, lng: -95.384882},
		category: "culture"
	},
	{
		name: "Rienzi, Museum of Fine Arts, Houston",
		coordinates: {lat: 29.757232, lng: -95.417005},
		category: "art"
	},
	{
		name: "Buffalo Soldiers National Museum",
		coordinates: {lat: 29.735974, lng: -95.378130},
		category: "other"
	},
	{
		name: "Children's Museum of Houston",
		coordinates: {lat: 29.722682, lng: -95.385113},
		category: "other"
	}
];


var map, infowindow, filter;


// VIEW MODEL
var ViewModel = function() {
	
	// jquery stuff
	// toggle show hide museum list
	$('.slidingDiv').hide();

	$('.show_hide').click(function( e ){
        $(this).find('i:first').toggleClass('glyphicon glyphicon-plus glyphicon glyphicon-minus');
        $(".slidingDiv").slideToggle();
	});
	

	var self = this;

	// locations array
	locations_ko = ko.observableArray(locations);
	searchResults = ko.observableArray(locations);

	// markers array
	var markers = ko.observableArray();
	var marker, i;

	var infowindow = new google.maps.InfoWindow();
	
	// create markers associate with each location
	createMarkers();

	/* When list item is clicked, open info window and make marker bounce on map */
	self.openInfowindow = function(locations_ko) {
		// locations is the list item clicked in html
		console.log(locations_ko.name);

		google.maps.event.trigger(locations_ko.marker, "click");
	}

	// data structure of option object
	var Option = function(name, id) {
        this.optionName = name;
        this.optionId = id;
    };
 
    // filter dropdown options
    self.availableOptions = ko.observableArray([
    		new Option("All", 5),
            new Option("Science", 1),
            new Option("Art", 2),
            new Option("Culture", 3),
            new Option("Other", 4)            
        ]),
    self.selectedOption = ko.observable(5);
    
    self.selectedOption.subscribe(function (newValue) {
    	filter = newValue;
    	console.log(filter);

    	if (filter == 5){
    		searchResults(locations);
    		for(var i = 0; i < locations_ko().length; i++){
    			showMarker(locations_ko()[i].marker);
    		}
    	}

    	else if (filter == 1){
    		searchResults([]);
    		for (var i = 0; i < locations_ko().length; i++){
    			if (locations_ko()[i].category == "science") {
    				searchResults.push(locations_ko()[i]);
    				showMarker(locations_ko()[i].marker);
    			}
    			else{
    				hideMarker(locations_ko()[i].marker);
    			}
    		}
    	}

    	else if (filter == 2){
    		searchResults([]);
    		for (var i = 0; i < locations_ko().length; i++){
    			if (locations_ko()[i].category == "art") {
    				searchResults.push(locations_ko()[i]);
    				showMarker(locations_ko()[i].marker);
    			}
    			else{
    				hideMarker(locations_ko()[i].marker);
    			}
    		}
    	}

    	else if (filter == 3){
    		searchResults([]);
    		for (var i = 0; i < locations_ko().length; i++){
    			if (locations_ko()[i].category == "culture") {
    				searchResults.push(locations_ko()[i]);
    				showMarker(locations_ko()[i].marker);
    			}
    			else {
    				hideMarker(locations_ko()[i].marker);
    			}
    		}
    	}

    	else if (filter == 4){
			searchResults([]);
    		for (var i = 0; i < locations_ko().length; i++){
    			if (locations_ko()[i].category == "other") {
    				searchResults.push(locations_ko()[i]);
    				showMarker(locations_ko()[i].marker);
    			}
    			else {
    				hideMarker(locations_ko()[i].marker);
    			}
    		}
    	}
    })
    
    
    // helper function to hide markers
    function hideMarker(marker) {
    	marker.setMap(null);
    	
    }

    // helper function to show markers
    function showMarker(marker) {
    	marker.setMap(map);
    }

    var prev_marker = null;

	// Create Markers
	function createMarkers() {
		// clear markers array
		markers([]);
		for (i = 0; i < locations_ko().length; i++){
			console.log("marker");
		
			marker = new google.maps.Marker({
				map: map,
				draggable: true,
				position: locations_ko()[i].coordinates,
				animation: google.maps.Animation.DROP,
			});
			markers.push(marker);
			locations_ko()[i].marker = marker;
			
			google.maps.event.addListener(marker, "click", (function(marker, i){
				return function() {
					prev_marker = toggleBounce(prev_marker, marker);
					infowindow.setContent(locations_ko()[i].name);
					getFS(locations_ko()[i]);
					infowindow.open(map, marker);
				
				}
			})(marker, i));

			// disable marker animation when infowindow is closed
			google.maps.event.addListener(infowindow, 'closeclick', function() {  
				for (i = 0; i < locations_ko().length; i++){
					locations_ko()[i].marker.setAnimation(null);
				}
			});
		};
	};

	// load foursquare information with foursquare api 
	function getFS(theLocation) {
		var foursquareURL = "https://api.foursquare.com/v2/venues/search?limit=1" + 
    					"&ll=" + theLocation.coordinates.lat + "," + theLocation.coordinates.lng +
    					"&client_id=EHDAYQ50Z0SW5VPUDYNUGR0K2GW23A2KSJ0GJH2AOCZ3QYDS" + 
    					"&client_secret=2LTUBTIJ2LB2HOURRUV2MGIBM2ZA5AFXRNQMYLKALMJUVJ5Q" +
    					"&v=20140806";

    	var results, name, location, contact, url, hours, rating;
    	$.getJSON(foursquareURL, function(data) {
        	results = data.response.venues[0],
        	name = results.name,
        	location = results.location.formattedAddress,
    		contact = results.contact.formattedPhone,
    		url = results.url,
    		rating = results.rating,
    		setInfo(theLocation, location, contact, rating);
    		
    	}).error(function(e){
    		infowindow.setContent("FourSquare information could not be loaded");
    	});
	}

	// set content to info window of marker
	function setInfo(theLocation, location, contact, rating) {
		if (contact) {
			infowindow.setContent(theLocation.name + "<br>" +
    							location + "<br>" + 
    							contact + "<br>" + 
    							"From FourSquare");
		}
		else{
			infowindow.setContent(theLocation.name + "<br>" +
    							location + "<br>" + 
    							"Phone number is not availabe" + "<br>" + 
    							"From FourSquare");
		}
	}

	// toggle marker when marker is clicked
	function toggleBounce(prev_marker, marker) {    
        var new_marker = marker;

        if (prev_marker) {        	
        	if (prev_marker.getAnimation != null) {
        		if (prev_marker != new_marker){
        			prev_marker.setAnimation(null);
        			new_marker.setAnimation(google.maps.Animation.BOUNCE);	
        			prev_marker = new_marker;
        		}

        	}
        } 
        else {
        	new_marker.setAnimation(google.maps.Animation.BOUNCE);
        	prev_marker = new_marker;
        } 
        return prev_marker; 
    }

};

// Function to load map and start up app
function initMap() {
	console.log("initMap");

	// Load Google Map 
 	map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 29.735974, lng: -95.399633}, 
    	zoom: 14,   
    	mapTypeControl: true
  	});

 	// resize map when browser size changes (responsive map)
 	google.maps.event.addDomListener(window, "resize", function() {
    	var center = map.getCenter();
    	google.maps.event.trigger(map, "resize");
    	map.setCenter(center); 
	});

  	//Instantiate ViewModel
  	ko.applyBindings(new ViewModel());
};

// google map error handling function
function googleError() {
	alert("Google Map could not be loaded");
}


