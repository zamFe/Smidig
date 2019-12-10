let express = require('express');
let app = express();

let fs = require('fs');

app.get('*', function(req, res) {
	let URL = req.originalUrl;
	let target = req.path;
	let query = req.query;

	//Logs useful information
	console.log("path: " + target)
	console.log(query)

	if(URL.includes('..')){
		target = 'html/index';
	}
	if(URL.includes('action=')){
		switch(query.action){
			case 'getroute': 
				console.log(`Getting route: ${JSON.stringify(query)}`); //Sends the querystring given action=getroute in the URL as JSON
				break;
			case 'getlocations':
				console.log(`Getting locations: ${JSON.stringify(query)}`); //Sends the querystring given action=getlocations in the URL as JSON
				break;
			default: 
				res.send('400 - Bad Request')
		}
	}
	try {
		if(fs.existsSync(`./${target}.html`)){
			res.sendFile(`/${target}.html`,{root: __dirname});
		} else if (target === "/") {
			console.log("Blank path specified: Redirecting to index")
			res.sendFile(`/html/index.html`, {root: __dirname});
		} else {
			res.send('404 - This file does not exist');
		}
	} catch(e) {
		console.error(e);
	}
})

//Server listens on localhost:8080
//Visit pages by visiting localhost:8080/filepath

app.listen(8080);