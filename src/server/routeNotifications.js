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

function subscribeToRoute(subscription, id) {

    console.log("New subscription!")
    console.log(subscription)
    console.log(id)


    const options = {
        method: "POST",
        url: `https://api.tripgo.com/v1/trip/hook/${id}`,
        json: {
            url:'https://vy-reiser.herokuapp.com/api/updatedTrip'
        },
        headers: {
            "content-type": "application/json;charset=utf-8",
            //"X-TripGo-Key": keys.TRIPGO_KEY,
            //"x-api-key": keys.TRIPGO_KEY
        }
    }
    console.log(options);

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
            created: new Date().getTime()
        });

        subscriptionIDs[subscription["keys"]["auth"]] = {
            trip: tripIDs[id]
        };

        tripIDs[id][tripIDs[id].length-1].subscription = subscriptionIDs[subscription["keys"]["auth"]];

        console.log(tripIDs)
        console.log(subscriptionIDs)

        // Create payload
        const payload = JSON.stringify({title: "Du får nå viktige varsler om ruten med id: " + id});

        sendNotification(subscription, payload)

    })

}

function sendNotification(subscription, payload){
    // Pass object into sendNotification
    webpush
        .sendNotification(subscription, payload)
        .catch(err => console.error(err));
}

function notifyChange (trip){

    console.log(trip)
    let users = tripIDs[trip.tripID];

    for (let user in users) {
        sendNotification(user.subscription, JSON.stringify(
            {
                title: "Det har skjedd en forandring på ruten"
            }
            ))
    }
}



module.exports = {subscribeToRoute, notifyChange};