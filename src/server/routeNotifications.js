const webpush = require('web-push')
const request = require('request')
const keys = require('./get-api-keys.js')

const publicVapidKey = "BKTEYj8Zc0k5p1D3WIYqPy8mg__7QdJVfqdSY5IuUJOM3OL7nHq-5qVTm0JrCy36oxa8MYcSNZRU0OQC87FcAg4";
const privateVapidKey = "XFSYXRuJ6lfuvUu6-kvFtlcplGmqvArn4bMAwb9Un20";

const usersToNotify = {

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
            url:'https://vy-reiser.herokuapp.com/api/log'
        },
        headers: {
            "content-type": "application/json;charset=utf-8",
            "X-TripGo-Key": keys.TRIPGO_KEY,
            "x-api-key": keys.TRIPGO_KEY
        }
    }
    console.log(options)

    request.post(options, (err, response) => {
        if (err) {
            return console.log(err);
        }

        console.log("Status code: ")
        console.log(response.statusCode)
        console.log(response.body)

        if(response.statusCode !== 200 && response.statusCode !== 204)
            return;

        usersToNotify[id] = subscription;

        // Create payload
        const payload = JSON.stringify({title: "Du får nå viktige varsler om ruten med id: " + id});

        // Pass object into sendNotification
        webpush
            .sendNotification(subscription, payload)
            .catch(err => console.error(err));
    })

}



module.exports = {subscribeToRoute};