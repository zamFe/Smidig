let request = require('request');
let fs = require('fs');
let querystring = require('querystring');
// let server = require('./server.js');

//let rp = require('request-promise-native');

// console.log(querystring.decode("a=(59.9233%2C10.79249)"))

function fromTripGo(args, res) {

    fs.readFile('api-keys/tripgo.properties', 'utf8', (err, data) => {
        if (err) throw err;
        getData(data, args, res);
    });
}


function getData(key, args, res) {

    query = convertQuery(args.parameters);

    // console.log(query)

    var options = {
        url: 'https://api.tripgo.com/v1/' + args.requestFile + query,
        headers: {
            'User-Agent': 'request',
            'X-TripGo-Key': key
        }
    };

    // const requestPromise = util.promisify(request);
    // const response = await requestPromise(options.url);
    request(options, (error, response, body)=>{
        args.callback(error, response, body, res);
    }); //, {form:{key:'value'}}
    // console.log(response)

    

    // let resp = await doRequest(options);

    // console.log(resp)

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
        data: `The API Call failed with message:\n\t ${error} \nCannot display routes`
    }

}

function formatData(data) {
	//console.log(data)
    trips = data.groups[0].trips;
    

    var formattedData = [];

    for (var i = 0; i < trips.length; i++) {
    	var d = trips[i];

    	formattedData[i] = {
    		cost: (d.moneyCost)?d.moneyCost:149,
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
    			stops: r[j].stops,
                waypoints: {
                    streets: segment.streets,
                    color: segment.modeInfo.color
                }

    		}
    	}
    }

    return formattedData;

}

function getSegmentTemplate (data, hashCode) {

	for (var i = 0; i < data.segmentTemplates.length; i++) {
		// console.log(data.segmentTemplates[i].hashCode + ", " + hashCode)
		if (data.segmentTemplates[i].hashCode === hashCode) {
			return data.segmentTemplates[i];
		}
	}

}

function getRouteData(error, response, body, res) {
	var data = errorHandling(error, response, body);
	console.log(data);
    if (data.statusCode != 200) {
		transmitData(data, res);
    } else {
		transmitData({statusCode: 200,
			data: formatData(data.data)}, res
		);
	}
}

function getLocationData (error, response, body, res) {
    var data = errorHandling(error, response, body);
    console.log(data);
    if (data.statusCode != 200) {
        transmitData(data, res);
    } else {

        if (data.data.usererror) {
            data.data.choices = [];
        }

        transmitData({statusCode: 200,
            data: data.data}, res
        );
    }
}

function transmitData (data, res) {
	res.json(data);
}

function getRoute (from, to, dateTime, res) {
	fromTripGo({
	    requestFile: "routing.json",

	    parameters: {
	        from: from,
	        to: to,
	        departAfter: 1575889860,
	        modes: "pt_pub",
	        unit: "auto",
	        wp: "(1,1,1,1)",
	        locale: "no",
	        bestOnly: true,
	        // ir: 1,
	        // ws: 1,
	        // cs: 1,
	        // tt: 0,
	        v: 11

	    },
	    callback: getRouteData
	}, res)
}

function getLocation (loc, res) {
    fromTripGo({
        requestFile: "geocode.json",

        parameters: {
            q: loc
        },
        callback: getLocationData
    }, res)
}



module.exports.getRoute = getRoute;
module.exports.getLocation = getLocation;

// from: "(59.9233,10.79249)",
// to: "(60.7945331,11.067997699999978)",