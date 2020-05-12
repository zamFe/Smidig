const express = require('express');
const app = express();
const path = require('path');

let api = require('./api-calls.js');
const routesApi = require("./routes/routes-api")

let fs = require('fs');

const users = require("./db/user-repo.js");
console.log(users.createUser("andreas@hotmail.com", "andreas", "østby", "apeKatten"));
console.log(users.loginUser("andreas@hotmail.com", "apeKatten"));

console.log(users.createUser("andreas@hotmail.com", "aasdndreas", "øby", "apeasKatten"));
console.log(users.loginUser("andreas@hotmail.com", "apeKattenen"));

// Serves the static files: HTML CSS and Bundle.JS
app.use(express.static('public'));

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

    if(URL.includes('action=')){
        switch(query.action){
            case 'getroute':
                api.getRoute(query.from, query.to, query.datetime, res);
                return;
            case 'getlocation':
                api.getLocation(query.q, res);
                return;
            case 'getmap':
                api.getMap(res);
                return;
            default:
                res.send('400 - Bad Request')
        }
    } else {
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
    }
})

/* Routes */
app.use('/api', routesApi);

app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'index.html'));
})

module.exports = app;