let request = require('request');

let querystring = require('querystring');

let keys = require("./get-api-keys.js");


function fromTripGo(args, res) {
    getData(args, res);
}

function getMap(res) {

    var options = {
        url: 'https://maps.googleapis.com/maps/api/js?key=' + keys.GOOGLEMAPS_KEY + '&callback=initMap&libraries=geometry',
        headers: {
            'User-Agent': 'request'
        }
    };
    request(options, (error, response, body) => {
        res.json({error, response, body});
    });
}

function getData(args, res) {
    query = convertQuery(args.parameters);
    const nl = keys.TRIPGO_KEY.indexOf('\n')
    let key = keys.TRIPGO_KEY;
    if(nl >= 0) {
        key = key.substring(0, nl);
    }

    var options = {
        url: 'https://api.tripgo.com/v1/' + args.requestFile + query,
        headers: {
            'User-Agent': 'request',
            'X-TripGo-Key': key
        }
    };

    console.log(options)
    request(options, (error, response, body) => {
        args.callback(error, response, body, res);
    });
}

function getTripFromID(url, res) {

    var options = {
        method: "GET",
        url: url.replace("hook", "update")+"?locale=no",
        headers: {
            'User-Agent': 'request',
            'X-TripGo-Key': keys.TRIPGO_KEY
        }
    };

    request(options, (error, response, body) => {
        let data = response.body?formatData(JSON.parse(response.body)):{};
        res.json({
            statusCode: 200,
            data
        });
    });

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
        return {
            statusCode: response.statusCode,
            data: info
        }
    }

    return {
        statusCode: (error) ? error : response.statusCode,
        data: `Error: The API Call failed with message:\n\t ${error} \nCannot display routes`
    }

}

function formatData(data) {
    if (!data.groups || data.groups.length === 0) return [];

    trips = data.groups[0].trips;

    var formattedData = [];

    for (var i = 0; i < trips.length; i++) {
        var d = trips[i];

        formattedData[i] = {
            cost: (d.moneyCost) ? d.moneyCost : Math.floor((Math.random() * 300) + 100),
            map: {},
            startTime: d.depart,
            endTime: d.arrive,
            calories: d.caloriesCost,
            carbonCost: d.caloriesCost,
            alerts: data.alerts,
            route: [],
            id: d.id,
            hookURL: d.hookURL
        }

        // Route
        var r = d.segments;

        if (!r) {
            return formattedData;
        }

        for (var j = 0; j < r.length; j++) {

            var segment = getSegmentTemplate(data, r[j].segmentTemplateHashCode);

            formattedData[i].route[j] = {
                action: segment.modeInfo.alt,
                description: segment.mini.description,
                from: segment.from,
                to: segment.to,
                operatorName: segment.serviceOperator,
                operatorID: segment.operatorID,
                alertHashcodes: r[j].alertHashCodes,
                stops: r[j].stops,
                platform: r[j].platform,
                endPlatform: r[j].endPlatform,
                serviceName: r[j].serviceName,
                serviceNumber: r[j].serviceNumber,
                serviceTripID: r[j].serviceTripID,
                startTime: r[j].startTime,
                endTime: r[j].endTime,
                stops: r[j].stops,
                metres: segment.metres,
                waypoints: {
                    shapes: (segment.shapes) ? segment.shapes : [],
                    color: segment.modeInfo.color
                }

            }
        }
    }

    return formattedData;
}

function getSegmentTemplate(data, hashCode) {

    for (var i = 0; i < data.segmentTemplates.length; i++) {
        if (data.segmentTemplates[i].hashCode === hashCode) {
            return data.segmentTemplates[i];
        }
    }
}

function getRouteData(error, response, body, res) {
    var data = errorHandling(error, response, body);

    if (data.statusCode !== 200) {
        transmitData(data, res);
    } else {
        transmitData({
            statusCode: 200,
            data: formatData(data.data)
        }, res);
    }
}

function transmitData(data, res) {
    res.json(data);
}

function getRoute(from, to, dateTime, priority, res) {
    fromTripGo({
        requestFile: "routing.json",

        parameters: {
            from: from,
            to: to,
            departAfter: dateTime,
            modes: "pt_pub",
            unit: "auto",
            wp: priority,
            locale: "no",
            includeStops: true,
            bestOnly: true,
            v: 11
        },
        callback: getRouteData
    }, res)
}

getLocation = (q, res) => {
    const options = {
        method: "GET",
        url: `https://api.entur.io/geocoder/v1/autocomplete?text=${q}&size=20&lang=no`,
        headers: {
            "cache-control": "no-cache, no-store, max-age=0, must-revalidate",
            "content-type": "application/json;charset=utf-8",
            "expires": 0,
            "pragma": "no-cache"
        }
    }

    request.get(options,  (err, response, body) => {
        if (err) {
            return console.log(err);
        }

        res.json(body)
    })
}


module.exports.getMap = getMap;
module.exports.getRoute = getRoute;
module.exports.getLocation = getLocation;
module.exports.getTripFromID = getTripFromID;