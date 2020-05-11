const express = require('express');
const app = express();
const path = require('path');

let request = require('request');

let api = require('./api-calls.js');

let fs = require('fs');

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



	try {
		if(fs.existsSync(`.${target}.${dotfile}`)){
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
	} catch(e) {
		console.error(e + "AAAAAAAAAAAAa");
	}

	//res.sendFile(path.resolve(__dirname, "..", "client", `index.html`))
})

app.use((req, res, next) => {
	res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'index.html'));
})

const port = process.env.port || 8080;
app.listen(port, () => {
	console.log('Started server on port: ' + port);
})

/*

app.get('*', function(req, res) {
	let URL = req.originalUrl;
	let target = req.path.substring(0,(req.path.includes('.') ? req.path.lastIndexOf('.') : req.path.length));
	let dotfile = "html";
	req.path.includes('.') ? dotfile = req.path.substring(req.path.lastIndexOf('.')+1) : "html";
	
	let query = req.query;

	//Logs useful information
	console.log("path: " + target)
	console.log(query)
	console.log(dotfile)

	if(URL.includes('..')){
		target = '../client/index';
	}
	if(URL.includes('action=')){
		switch(query.action){
			case 'getroute': 
				api.getRoute(query.from, query.to, query.datetime, res);
				break;
			case 'getlocation':
				api.getLocation(query.q, res);
				break;
			case 'getmap':
				api.getMap(res);
				break;
			default: 
				res.send('400 - Bad Request')
		}
	} else {
		try {
			if(fs.existsSync(`.${target}.${dotfile}`)){
				console.log(`Sending file: ${target}.${dotfile}`)
				res.sendFile(`${target}.${dotfile}`,{root: __dirname});
			} else if (target === "/") {
				console.log("Blank path specified: Redirecting to index")
				res.sendFile(`../client/index.html`, {root: __dirname});
			} else {
				console.error(`Did not find ${target}.${dotfile}`)
				res.send('404 - This file does not exist');
			}
		} catch(e) {
			console.error(e + "AAAAAAAAAAAAa");
		}
	}
})


//Server listens on localhost:8080
//Visit pages by visiting localhost:8080/filepath

app.listen(8080);*/