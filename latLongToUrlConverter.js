module.exports = {
	convertLatLongToAPIUrl: function(latLong) {
		var latLongArray = latLong.split(','),
			latitude = parseFloat(latLongArray[0]);
	    	longitude = parseFloat(latLongArray[1]);

	    var maxLat = latitude + 0.5,
	    	minLat = latitude - 0.5,
	    	maxLong = longitude + 0.5,
	    	minLong = longitude - 0.5;

	    var baseUrl = 'https://data.sfgov.org/resource/rqzj-sfat.json?$where=';
	    baseUrl += 'latitude < ' + maxLat + ' AND '
	              + 'latitude > ' + minLat + ' AND '
	              + 'longitude < ' + maxLong + ' AND '
	              + 'longitude > ' + minLong;
	    return baseUrl;
	}
}