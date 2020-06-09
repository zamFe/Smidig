const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const path = require('path');

let api = require('./api-calls.js');
let notif = require("./routeNotifications.js")
const routesApi = require("./routes/routes-api")

let fs = require('fs');

// Serves the static files: HTML CSS and Bundle.JS
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Subscribe Route
app.post("/subscribe", (req, res) => {
    // Get pushSubscription object
    const subscription = req.body;
    const id = req.query.id;
    const departure = req.query.departure;
    const arrival = req.query.arrival;

    if (!id || !departure || !arrival || Object.keys(subscription).length === 0) {
        res.status(400).json({});
        return;
    }

    // Send 201 - resource created
    res.status(201).json({});

    notif.subscribeToRoute(subscription, id, departure, arrival);
});

// Subscribe Route
app.post("/unsubscribe", (req, res) => {
    // Get pushSubscription object
    const subscription = req.body;
    const id = req.query.id;

    if (!id || Object.keys(subscription).length === 0) {
        res.status(400).json({});
        return;
    }

    // Send 201 - resource created
    res.status(201).json({});

    notif.unsubscribeFromRoute(subscription, id);
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
        console.error(e);
    }
})

app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'index.html'));
})



module.exports = app;