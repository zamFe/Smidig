const app = require("./app")
const fs = require("fs");
const path = require('path');

const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log('Started server on port: ' + port);
	console.log("URL: " + "http://localhost:" + port);
	console.log("---------------");
})