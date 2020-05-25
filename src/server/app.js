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

    // Send 201 - resource created
    res.status(201).json({});

    notif.subscribeToRoute(subscription);
});

/*notif.subscribeToRoute({
        endpoint: 'https://fcm.googleapis.com/fcm/send/f2r3Pe-w6gg:APA91bE5xX7ZNxmzLq1Ip8Bp4cdUtPvOzje-5gtWEtLY9VvuI5UeN5kTbVM4NbtxzP2Ay4u497asINUhYlKe0ff6pIw0iHPsp1tMcvdeOMt7pnlKzCcEpuPvrSn3oog-fJHnXQlLmpBq',
        expirationTime: null,
        keys: {
            p256dh: 'BANFXus34CAgdPW1YhLfIyMwlbrtcShLJ-uGMG3D3MU7S1KosEtAomxrJMfN2EED-aFamXrRv2uXMm88zHOA-q0',
            auth: 'S6gylkORVsnW0MoTF1Pvww'
        }
    }
)*/


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