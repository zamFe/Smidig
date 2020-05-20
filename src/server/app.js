const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const path = require('path');
const webpush = require('web-push')

let api = require('./api-calls.js');
const routesApi = require("./routes/routes-api")

let fs = require('fs');

// Serves the static files: HTML CSS and Bundle.JS
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const publicVapidKey = "BKTEYj8Zc0k5p1D3WIYqPy8mg__7QdJVfqdSY5IuUJOM3OL7nHq-5qVTm0JrCy36oxa8MYcSNZRU0OQC87FcAg4";
const privateVapidKey = "XFSYXRuJ6lfuvUu6-kvFtlcplGmqvArn4bMAwb9Un20";

webpush.setVapidDetails("mailto:test@test.com", publicVapidKey, privateVapidKey);

// Subscribe Route
app.post("/subscribe", (req, res) => {
    // Get pushSubscription object
    const subscription = //req.body;

    // Send 201 - resource created
    res.status(201).json({});

    // Create payload
    const payload = JSON.stringify({ title: "Push Test" });

    console.log("MESSAGE BACK")
    // Pass object into sendNotification
    webpush
        .sendNotification(subscription, payload)
        .catch(err => console.error(err));
});


/* Routes */
app.use('/api', routesApi);

app.use((req, res, next) => {
    let URL = req.originalUrl;
    let target = req.path.substring(0,(req.path.includes('.') ? req.path.lastIndexOf('.') : req.path.length));
    let dotfile = "html";
    req.path.includes('.') ? dotfile = req.path.substring(req.path.lastIndexOf('.')+1) : "html";

    let query = req.query;

    //Logs useful information
    console.log("path: " + target)
    console.log(query)
    console.log(dotfile)
    console.log("URL: " + URL)

    try {
        if (fs.existsSync(`.${target}.${dotfile}`)) {
            target = target.substring(target.lastIndexOf('/'));
            console.log(`Sending file: ${target}.${dotfile}`)
            res.sendFile(path.resolve(__dirname, "..", "client", `.${target}.${dotfile}`));
        } else if (target === "/") {
            console.log("Blank path specified: Redirecting to index")
            res.sendFile(path.resolve(__dirname, "..", "client", `index.html`));
        } else {
            console.error(`Did not find ${target}.${dotfile}`)
            res.send('404 - This file does not exist');
        }
    } catch (e) {
        console.error(e + "AAAAAAAAAAAAa");
    }
})

app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'index.html'));
})



module.exports = app;