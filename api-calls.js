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

function convertQuery(query) {
    if (query == "") {
        return "";
    }
    return "?" + querystring.encode(query);
}

function errorHandling(error, response, body) {

    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        //console.log(body);
        return {
            statusCode: response.statusCode,
            data: info
        }

    }

    return {
        statusCode: (error)?error:response.statusCode,
        data: (error)?error:response
    }

}

function formatData(data) {
	//console.log(data)
    trips = data.groups[0].trips;
    

    var formattedData = [];

    for (var i = 0; i < trips.length; i++) {
    	var d = trips[i];

    	formattedData[i] = {
    		cost: (d.moneyCost)?d.moneyCost:"Ukjent",
    		map: {},
    		startTime: d.depart,
    		endTime: d.arrive,
    		calories: d.caloriesCost,
    		carbonCost: d.caloriesCost,
    		route: []
    	}

    	// Route
    	var r = d.segments;

    	if (!r) {
    		return formattedData;
    	}

    	for (var j = 0; j < r.length; j++) {

    		var segment = getSegmentTemplate(data, r[j].segmentTemplateHashCode);

    		//console.log(segment)
    		formattedData[i].route[j] = {
    			action: segment.modeInfo.alt,
    			description: segment.mini.description,
    			from: segment.from,
    			to: segment.to,
    			//time: r[j].durationString,
    			operatorName: segment.serviceOperator,
    			stops: r[j].stops,
    			platform: r[j].platform,
    			endPlatform: r[j].endPlatform,
    			serviceName: r[j].serviceName,
    			serviceNumber: r[j].serviceNumber,
    			startTime: r[j].startTime,
    			endTime: r[j].endTime,
    			stops: r[j].stops

    		}
    	}

    }

    return formattedData

}

function getSegmentTemplate (data, hashCode) {

	for (var i = 0; i < data.segmentTemplates.length; i++) {
		// console.log(data.segmentTemplates[i].hashCode + ", " + hashCode)
		if (data.segmentTemplates[i].hashCode === hashCode) {
			return data.segmentTemplates[i];
		}
	}

}

function getRouteData(error, response, body) {
    var data = errorHandling(error, response, body);

    if (data.statusCode != 200) {
        transmitData(data);
    } else {
		transmitData(formatData(data.data));
	}
}

function transmitData (data) {
	console.log(JSON.stringify(data));
}

function getRoute () {
	fromTripGo({ //geocode
	    requestFile: "routing.json",

	    parameters: {
	        from: "(59.9233,10.79249)",
	        to: "(60.7945331,11.067997699999978)",
	        departAfter: 1575889860,
	        modes: "pt_pub",
	        unit: "auto",
	        //wp: "(1,1,1,1)",
	        locale: "no",
	        bestOnly: true,
	        // ir: 1,
	        // ws: 1,
	        // cs: 1,
	        // tt: 0,
	        v: 11

	    },
	    // parameters: '?from=(' + args.from + ')&to=(' + args.to + ')&departAfter=1575889860&arriveBefore=0&modes=me_car&wp=(1%2C1%2C1%2C1)&tt=0&unit=auto&v=11&locale=en&ir=1&ws=1&cs=1',
	    callback: getRoute
	})
}

export {getRoute} 