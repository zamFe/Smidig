var request = require('request');
var fs = require('fs');
var querystring = require('querystring');

// console.log(querystring.decode("a=(59.9233%2C10.79249)"))

function fromTripGo(args) {

    fs.readFile('api-keys/tripgo.properties', 'utf8', (err, data) => {
        if (err) throw err;
        getData(data, args);
    });
}

function getData(key, args) {

	query = convertQuery(args.parameters);

	// console.log(query)

    var options = {
        url: 'https://api.tripgo.com/v1/' + args.requestFile + query,
        headers: {
            'User-Agent': 'request',
            'X-TripGo-Key': key
        }
    };

    request(options, args.callback); //, {form:{key:'value'}}

}

function convertQuery (query) {
	if (query == "") {
		return "";
	}
	return "?" + querystring.encode(query);
}

function getRoute (error, response, body) {

    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(JSON.stringify(info));

    } else {
        console.log(response)
    }
}

fromTripGo({ //geocode
    requestFile: "routing.json",
    
    parameters: {
    	from: "(59.9233,10.79249)",
    	to: "(60.7945331,11.067997699999978)",
    	departAfter: 1575889860,
    	modes: "pt_pub",
    	unit: "auto",
    	//wp: "(1,1,1,1)",
    	locale: "en"
    	// ir: 1,
    	// ws: 1,
    	// cs: 1,
    	// tt: 0,
    	// v: 11

    },
   // parameters: '?from=(' + args.from + ')&to=(' + args.to + ')&departAfter=1575889860&arriveBefore=0&modes=me_car&wp=(1%2C1%2C1%2C1)&tt=0&unit=auto&v=11&locale=en&ir=1&ws=1&cs=1',
    callback: getRoute
})