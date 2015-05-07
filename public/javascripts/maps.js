var socket = io();

var x = document.getElementById("demo");

var map;

function showError(error) {
  switch(error.code) {
      case error.PERMISSION_DENIED:
          x.innerHTML = "User denied the request for Geolocation."
          break;
      case error.POSITION_UNAVAILABLE:
          x.innerHTML = "Location information is unavailable."
          break;
      case error.TIMEOUT:
          x.innerHTML = "The request to get user location timed out."
          break;
      case error.UNKNOWN_ERROR:
          x.innerHTML = "An unknown error occurred."
          break;
  }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
	var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //var myLatlng = new google.maps.LatLng('37.7770972708968645787', '-122.415102651361645787');

  var mapOptions = {
    center: myLatlng,
    zoom: 16
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions); 

  var image = 'images/user_location.png';

  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'You are here!',
      icon: image
  });

  socket.emit('latlong', position.coords.latitude + ',' + position.coords.longitude);
}

google.maps.event.addDomListener(window, 'load', getLocation);

socket.on('results', function(foodTrucks) {
  var arrayOfFoodTrucks = JSON.parse(foodTrucks);

  console.log(arrayOfFoodTrucks.length);

  arrayOfFoodTrucks.forEach(function (element) {
    console.log(element);

    var myLatlng = new google.maps.LatLng(element.latitude, element.longitude);

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

    var image = 'images/truck.png';
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: element.applicant,
      icon: image
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
  });
});

