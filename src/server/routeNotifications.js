const webpush = require('web-push')
const request = require('request')
const keys = require('./get-api-keys.js')

const publicVapidKey = "BKTEYj8Zc0k5p1D3WIYqPy8mg__7QdJVfqdSY5IuUJOM3OL7nHq-5qVTm0JrCy36oxa8MYcSNZRU0OQC87FcAg4";
const privateVapidKey = "XFSYXRuJ6lfuvUu6-kvFtlcplGmqvArn4bMAwb9Un20";

webpush.setVapidDetails("mailto:test@test.com", publicVapidKey, privateVapidKey);

function subscribeToRoute(subscription, id) {
    // Create payload
    const payload = JSON.stringify({title: "Du får nå viktige varsler om ruten med id: " + id});

    console.log("New subscription!")
    console.log(subscription)
    console.log(id)

    // Pass object into sendNotification
    webpush
        .sendNotification(subscription, payload)
        .catch(err => console.error(err));

    const options = {
        method: "POST",
        url: `https://api.tripgo.com/v1/trip/hook/${id}`,
        body: {
            "url": "https://vy-reiser.herokuapp.com/api/log",
        },
        headers: {
            "content-type": "application/json;charset=utf-8",
            "x-api-key": keys.TRIPGO_KEY
        }
    }
    console.log(JSON.stringify(options))

    request.post(JSON.stringify(options), (err, response) => {
        if (err) {
            return console.log(err);
        }

        console.log("response")
        console.log(response)
        console.log("body")
        console.log(body)
    })

}



module.exports = {subscribeToRoute};