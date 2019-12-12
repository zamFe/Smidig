let express = require('express');
let app = express();

let tripGo = require('./api-calls.js');

let fs = require('fs');

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
		target = 'html/index';
	}
	if(URL.includes('action=')){
		switch(query.action){
			case 'getroute': 
				tripGo.getRoute(query.from, query.to, query.datetime, res);
				break;
			case 'getlocations':
				console.log(`Getting locations: ${JSON.stringify(query)}`); //Sends the querystring given action=getlocations in the URL as JSON
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
				res.sendFile(`/html/index.html`, {root: __dirname});
			} else {
				console.error(`Did not find ${target}.${dotfile}`)
				res.send('404 - This file does not exist');
			}
		} catch(e) {
			console.error(e);
		}
	}
})

function toRoutesWithQuery (queryString, res) {
	res.json(queryString);
	//console.log(queryString);
}

module.exports.toRoutesWithQuery = toRoutesWithQuery;

//Server listens on localhost:8080
//Visit pages by visiting localhost:8080/filepath

app.listen(8080);