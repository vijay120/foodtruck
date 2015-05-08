var latLongConverter = require('../latLongToUrlConverter'),
	assert = require('assert');

describe('latLongConverter', function(){
  describe('convertLatLongToAPIUrl', function(){
    it('should return the correct url when valid input latLong is present', function(){
    	var testLatLong = '123,456';
    	var result = latLongConverter.convertLatLongToAPIUrl(testLatLong);
    	var expectedResult = 'https://data.sfgov.org/resource/rqzj-sfat.json?$where=latitude < 123.5 AND latitude > 122.5 AND longitude < 456.5 AND longitude > 455.5';
    	assert.equal(result, expectedResult);
    })
  })
})