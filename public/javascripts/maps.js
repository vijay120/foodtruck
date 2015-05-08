var socket = io();

// This is the map element that will be embedded onto the app.
var map;

// Update the status bar with content
function updateStatusBar(content) {
  console.log('content is ', content);
  document.getElementById("status").innerHTML = content;
}

// This function propogates errors to the status bar
function showError(error) {
  switch(error.code) {
      case error.PERMISSION_DENIED:
          updateStatusBar('User denied the request for Geolocation.');
          break;
      case error.POSITION_UNAVAILABLE:
          updateStatusBar('Location information is unavailable.');
          break;
      case error.TIMEOUT:
          updateStatusBar('The request to get user location timed out.');
          break;
      case error.UNKNOWN_ERROR:
          updateStatusBar('An unknown error occurred.');
          break;
  }
}

// This function is driver that prompts the user if he/she wants to use
// geolocation.
function getLocation() {
    if (navigator.geolocation) {
      updateStatusBar("Calculating food trucks near you...");
      navigator.geolocation.getCurrentPosition(showMyPosition, showError);
    } else {
      updateStatusBar("Geolocation is not supported by this browser.");
    }
}

// This function calculates the user's geolocated position and returns
// results based on that.
function showMyPosition(position) {
	var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  // use this for test value: myLatLng = new google.maps.LatLng('37.7770972708968645787', '-122.415102651361645787');

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

function renderTruckHTMLSnippet(truckResult) {
  // This conditional is specifically to sanitize and format the food items result
  if (truckResult.fooditems) {
    truckResult.fooditems = truckResult.fooditems.replace(/:/g, ',');
  } else {
    truckResult.fooditems = ''
  }

  var contentString = '<div id="content"><div id="siteNotice"></div>' +
      '<h1 id="firstHeading" class="firstHeading">' + truckResult.applicant + '</h1>' +
      '<div id="bodyContent">' + '<p><b>Address</b>: ' + truckResult.locationdescription + '</p>' + 
      '<p><b>Food Items</b>: ' + truckResult.fooditems + '</p></p></div></div';

  return contentString;
}

// Once the window is loaded, get the location of the user.
google.maps.event.addDomListener(window, 'load', getLocation);

// Process the results returned from the server
socket.on('results', function(foodTrucks) {

  var arrayOfFoodTrucks = JSON.parse(foodTrucks);
  updateStatusBar('Found ' + arrayOfFoodTrucks.length + ' trucks near you');

  arrayOfFoodTrucks.forEach(function (element) {

    var foodTruckLatLng = new google.maps.LatLng(element.latitude, element.longitude);

    var renderedContent = renderTruckHTMLSnippet(element);

    var infowindow = new google.maps.InfoWindow({
      content: renderedContent
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
});