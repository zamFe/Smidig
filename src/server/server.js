

const app = require("./app")
const fs = require("fs");
const path = require('path');
//const https = require('https');
/*
const options = {
	cert: fs.readFileSync(path.join(__dirname, 'ssl', 'selfsigned.crt')),
	key: fs.readFileSync(path.join(__dirname, 'ssl', 'selfsigned.key'))
}

const server = https.createServer(options, app);

const securePort = 8443;

server.listen(securePort, ()=>{
	console.log("---------------")
	console.log("Server ssl started on port: " + securePort);
	console.log("URL: " + "https://localhost:" + securePort);
	console.log("URL to allow chrome for unsecure https on localhost: \nchrome://flags/#allow-insecure-localhost");
	console.log("");
})*/
const port = process.env.port || 8080;

app.listen(port, () => {
	console.log('Started server on port: ' + port);
	console.log("URL: " + "http://localhost:" + port);
	console.log("---------------");
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