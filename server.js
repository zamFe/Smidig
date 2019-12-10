var request = require('request');
var fs = require('fs');

fs.readFile('api-keys/tripgo.properties', 'utf8', (err, data) => {
  if (err) throw err;
  openServer(data);
});
 
function openServer(key) {
	var options = {
	  url: 'https://api.tripgo.com/v1/routing.json?from=(59.9233%2C10.79249)&to=(60.38568%2C5.33622)&departAfter=1575889860&arriveBefore=0&modes=me_car&wp=(1%2C1%2C1%2C1)&tt=0&unit=auto&v=11&locale=en&ir=1&ws=1&cs=1',
	  headers: {
	    'User-Agent': 'request',
	    'X-TripGo-Key': key
	  }
	};
	 
	function callback(error, response, body) {
		
	  if (!error && response.statusCode == 200) {
	    var info = JSON.parse(body);
	    console.log(info);

	  }else {
	  	console.log(response)
	  }
	}
	 
	request(options, callback);


}