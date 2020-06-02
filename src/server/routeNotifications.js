const webpush = require('web-push')
const request = require('request')
const keys = require('./get-api-keys.js')

const publicVapidKey = "BKTEYj8Zc0k5p1D3WIYqPy8mg__7QdJVfqdSY5IuUJOM3OL7nHq-5qVTm0JrCy36oxa8MYcSNZRU0OQC87FcAg4";
const privateVapidKey = "XFSYXRuJ6lfuvUu6-kvFtlcplGmqvArn4bMAwb9Un20";

const tripIDs = {

}

const subscriptionIDs = {

}

webpush.setVapidDetails("mailto:test@test.com", publicVapidKey, privateVapidKey);

function subscribeToRoute(subscription, url, departure, arrival) {

    console.log("New subscription!")
    console.log(subscription)
    console.log(url)

    let idArray = url.split("/")
    let id = idArray[idArray.length-1];

    console.log(id)
    const options = {
        method: "POST",
        url: url,
        json: {
            url:'https://vy-reiser.herokuapp.com/api/updatedtrip'
        },
        headers: {
            "content-type": "application/json;charset=utf-8",
            "X-TripGo-Key": keys.TRIPGO_KEY,
            "x-api-key": keys.TRIPGO_KEY
        }
    }
    console.log(options);
    let created = Math.floor(new Date().getTime()/1000);

    request.post(options, (err, response) => {
        if (err) {
            return console.log(err);
        }

        console.log("Status code: ")
        console.log(response.statusCode)
        console.log(response.body)

        if(response.statusCode !== 200 && response.statusCode !== 204)
            return;

        if (!tripIDs[id])
            tripIDs[id] = [];


        tripIDs[id].push({
            subscription:null,
            arrival,
            departure,
            created,
            url
        });


        subscriptionIDs[subscription["keys"]["auth"]] = {
            trip: tripIDs[id]
        };

        tripIDs[id][tripIDs[id].length-1].subscription = subscriptionIDs[subscription["keys"]["auth"]];

        console.log(tripIDs)
        console.log(subscriptionIDs)

    })
        setTimeout(()=>{
            // Create payload
            const payload = JSON.stringify({title:  Math.floor(Math.max((departure -new Date().getTime()/1000), 0)/60)+" min til reisen starter!", icon:"./res/img/logos/vy_not.png"});
            sendNotification(subscription, payload)
        }, ((departure-600) - created)*1000)// 600s = 10min


        // Create payload
        const payload = JSON.stringify({title: "Du får nå viktige varsler om ruten!", icon:"./res/img/logos/vy_not.png", data:url});

        sendNotification(subscription, payload)

}

function sendNotification(subscription, payload){
    // Pass object into sendNotification
    webpush
        .sendNotification(subscription, payload)
        .catch(err => console.error(err));
}

function notifyChange (trip){

    // TODO: remove hook if no user found
    console.log(trip)
    if (!trip) return;
    let id = trip.tripID;

    //let idArray = url.split("/")
    //let id = idArray[idArray.length-1];
    console.log(id, trip.tripURL)
    let users = tripIDs[id];
    if (!users) {
        // SHOULD UNSUBSCRIBE
        return;
    }

    console.log("-----users-----")
    console.log(users)
    for (let i = 0; i < users.length; i++){
        console.log(users[i].subscription)
        sendNotification(users[i].subscription, JSON.stringify(
            {
                title: "Det har skjedd en forandring på ruten!",
                body: "Trykk her for mer detaljer!",
                icon:"./res/img/logos/vy_not.png",
                data: trip.tripURL
            }
            ))

    }
}

function unsubscribe(id) {
    const options = {
        method: "DELETE",
        url: id,
        json: {
            url:'https://vy-reiser.herokuapp.com/api/updatedtrip'
        },
        headers: {
            "content-type": "application/json;charset=utf-8",
            "X-TripGo-Key": keys.TRIPGO_KEY,
            "x-api-key": keys.TRIPGO_KEY
        }
    }
    console.log(options);

    request.delete(options, (err, response) => {
        if (err) {
            return console.log(err);
        }

        console.log("Deleted webhook!")
        console.log("Status code: ")
        console.log(response.statusCode)
        console.log(response.body)

    })
}


module.exports = {subscribeToRoute, notifyChange};