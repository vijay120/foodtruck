var socket = io();

// This is the way the user will know what the app is currently doing.
var status = document.getElementById("status");

// This is the map element that will be embedded onto the app.
var map;

function showError(error) {
  switch(error.code) {
      case error.PERMISSION_DENIED:
          status.innerHTML = "User denied the request for Geolocation."
          break;
      case error.POSITION_UNAVAILABLE:
          status.innerHTML = "Location information is unavailable."
          break;
      case error.TIMEOUT:
          status.innerHTML = "The request to get user location timed out."
          break;
      case error.UNKNOWN_ERROR:
          status.innerHTML = "An unknown error occurred."
          break;
  }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showMyPosition, showError);
        status.innerHTML = "Calculating food trucks near you...";
    } else {
        status.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showMyPosition(position) {
	var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      myLatLng = new google.maps.LatLng('37.7770972708968645787', '-122.415102651361645787');

  var mapOptions = {
    center: myLatLng,
    zoom: 16
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions); 

  var myImage = 'images/user_location.png';

  var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: 'You are here!',
      icon: myImage
  });

  // Ask the server to find all food trucks near me.
  socket.emit('latlong', position.coords.latitude + ',' + position.coords.longitude);
}

// Once the window is loaded, get the location of the user.
google.maps.event.addDomListener(window, 'load', getLocation);

// Process the results returned from the server
socket.on('results', function(foodTrucks) {

  var arrayOfFoodTrucks = JSON.parse(foodTrucks);

  arrayOfFoodTrucks.forEach(function (element) {

    var foodTruckLatLng = new google.maps.LatLng(element.latitude, element.longitude);

    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">'+
      element.applicant + 
      '</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Address</b>: '+
      element.locationdescription+
      '</p>'+ 
      '<p><b>Food Items</b>: '+
      element.fooditems.replace(/:/g, ',') +
      '</p>'+ 
      '</p></div></div';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    var truckImage = 'images/truck.png';
    var marker = new google.maps.Marker({
      position: foodTruckLatLng,
      map: map,
      title: element.applicant,
      icon: truckImage
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
  });

  status.innerHTML = "Finished.";
});

