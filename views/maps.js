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

  socket.emit('latlong', position.coords.latitude.toString() + 
                          ',' + position.coords.longitude.toString());

  var base_url = 'https://data.sfgov.org/resource/rqzj-sfat.json?$where=';
  base_url += 'latitude > ' + position.coords.latitude.toString();


  var mapOptions = {
    center: myLatlng,
    zoom: 16
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions); 


    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';

    var infowindow = new google.maps.InfoWindow({
    	content: contentString
  	}); 

  	var marker = new google.maps.Marker({
  		position: myLatlng,
      	map: map,
      	title: 'Uluru (Ayers Rock)'
  	});

  	google.maps.event.addListener(marker, 'click', function() {
  		infowindow.open(map,marker);
  	});
}

google.maps.event.addDomListener(window, 'load', getLocation);

socket.on('results', function(foodTrucks) {
  var arrayOfFoodTrucks = JSON.parse(foodTrucks);
  arrayOfFoodTrucks.forEach(function (element) {

    var myLatlng = new google.maps.LatLng(element.latitude, element.longitude);

    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">'+
      element.applicant + 
      '</h1>'+
      '<div id="bodyContent">'+
      '<p>'+
      element.locationdescription+
      element.fooditems+
      '</p></div></div';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    }); 

    var marker = new google.maps.Marker({
      position: myLatlng,
        map: map,
        title: element.applicant
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
  });
});

