var ADJUSTABLEZOOM = 0.5;

module.exports = {
	convertLatLongToAPIUrl: function(latLong) {
		var latLongArray = latLong.split(','),
			latitude = parseFloat(latLongArray[0]);
	    	longitude = parseFloat(latLongArray[1]);

	    var maxLat = latitude + ADJUSTABLEZOOM,
	    	minLat = latitude - ADJUSTABLEZOOM,
	    	maxLong = longitude + ADJUSTABLEZOOM,
	    	minLong = longitude - ADJUSTABLEZOOM;

	    var baseUrl = 'https://data.sfgov.org/resource/rqzj-sfat.json?$where=';
	    baseUrl += 'latitude < ' + maxLat + ' AND '
	              + 'latitude > ' + minLat + ' AND '
	              + 'longitude < ' + maxLong + ' AND '
	              + 'longitude > ' + minLong;
	    return baseUrl;
	}
}