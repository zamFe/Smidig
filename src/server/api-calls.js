let request = require('request');
let fs = require('fs');
let querystring = require('querystring');

let GOOGLEMAPS_KEY = process.env.GoogleMaps || fs.readFileSync('src/server/api-keys/googleMaps.properties', 'utf8');
let TRIPGO_KEY = process.env.TripGo || fs.readFileSync('src/server/api-keys/tripgo.properties', 'utf8');

if (!GOOGLEMAPS_KEY) console.error("GOOGLE KEY MISSING");
if (!TRIPGO_KEY) console.error("TRIPGO KEY MISSING");

// console.log(querystring.decode("a=(59.9233%2C10.79249)"))

function fromTripGo(args, res) {
    getData(args, res);
}

function getMap(res) {

    var options = {
        url: 'https://maps.googleapis.com/maps/api/js?key=' + GOOGLEMAPS_KEY + '&callback=initMap&libraries=geometry',
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

    // console.log(query)

    var options = {
        url: 'https://api.tripgo.com/v1/' + args.requestFile + query,
        headers: {
            'User-Agent': 'request',
            'X-TripGo-Key': TRIPGO_KEY
        }
    };

    console.log(options)    // const requestPromise = util.promisify(request);
    // const response = await requestPromise(options.url);
    request(options, (error, response, body) => {
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
        statusCode: (error) ? error : response.statusCode,
        data: `Error: The API Call failed with message:\n\t ${error} \nCannot display routes`
    }

}

let status = true;
function formatData(data) {
    //console.log(data)
    if (!data.groups || data.groups.length === 0) return [];

    trips = data.groups[0].trips;


    var formattedData = [];

    for (var i = 0; i < trips.length; i++) {
        var d = trips[i];

        if(i === 0) {
            console.log("<-------------- Segments ------------------>")
            console.log(d.segments[1])
        }

        formattedData[i] = {
            cost: (d.moneyCost) ? d.moneyCost : Math.floor((Math.random() * 300) + 100),
            map: {},
            startTime: d.depart,
            endTime: d.arrive,
            calories: d.caloriesCost,
            carbonCost: d.caloriesCost,
            alerts: d.alerts,
            route: []
        }

        // Route
        var r = d.segments;

        if (!r) {
            return formattedData;
        }

        for (var j = 0; j < r.length; j++) {

            var segment = getSegmentTemplate(data, r[j].segmentTemplateHashCode);

            if(j === 0 && status) {
                console.log("<-------------- First Transport ------------------>")
                console.log(r);
                status = false;
            }

            formattedData[i].route[j] = {
                action: segment.modeInfo.alt,
                description: segment.mini.description,
                from: segment.from,
                to: segment.to,
                //time: r[j].durationString,
                operatorName: segment.serviceOperator,
                operatorID: segment.operatorID,
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
            // if (!segment.shapes && segment.streets) {
            //     formattedData[i].route[j].waypoints.shapes = segment.streets;
            // }
        }
    }

    return formattedData;

}

function getSegmentTemplate(data, hashCode) {

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
    if (data.statusCode !== 200) {
        transmitData(data, res);
    } else {
        transmitData({
            statusCode: 200,
            data: formatData(data.data)
        }, res);
    }
}

function getLocationData(error, response, body, res) {
    var data = errorHandling(error, response, body);
    console.log(data);
    if (data.statusCode !== 200) {
        transmitData(data, res);
    } else {

        if (data.data.usererror) {
            data.data.choices = [];
        }

        transmitData({
            statusCode: 200,
            data: data.data
        }, res);
    }
}

function transmitData(data, res) {
    res.json(data);
}

function getRoute(from, to, dateTime, res) {
    fromTripGo({
        requestFile: "routing.json",

        parameters: {
            from: from,
            to: to,
            departAfter: dateTime,
            modes: "pt_pub",
            unit: "auto",
            wp: "(1,1,1,1)",
            locale: "no",
            includeStops: true,
            bestOnly: true,
            //neverAllowAuthorities: "X6EXwvf7",
            // ir: 1,
            // ws: 1,
            // cs: 1,
            // tt: 0,
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
// from: "(59.9233,10.79249)",
// to: "(60.7945331,11.067997699999978)",