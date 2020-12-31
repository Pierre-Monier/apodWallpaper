#!/bin/env node
const request = require('request');
const https = require('https');
const fs = require('fs');
const { on } = require('process');

const url = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";

request(url, (error, res, body) => {
	if (error) {
		console.error('Error while fetching data', err);
		process.exit(1);
	}

	if (res.statusCode === 200) {
		const imageUrl = JSON.parse(body).url;
		const file = fs.createWriteStream("./images/wallpaper.jpg");
		https.get(imageUrl, function(response) {
			response.pipe(file);
		});
	} else {
		console.error(`Error, Response send with status code ${res.statusCode}`);
		process.exit(1);
	}
})
