#!/bin/env node
const request = require('request');
const { handleError, waitForInternetConnection, areArgsValid } = require('./utils');
const { downloadWallpaper, setImageAsWAllpaper } = require('./wallpaper');

const apiUrl = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";

const [,, ...args] = process.argv;

const main = () => {
	request(apiUrl, async (err, res, body) => {
		if (err) {
			handleError('Error while fetching data', err);
		}
	
		if (res.statusCode === 200) {
			await downloadWallpaper(body, args[0]);
			setImageAsWAllpaper(args[0]);
		} else {
			handleError(`Error, Response send with status code ${res.statusCode}`);
		}
	})
}

if (areArgsValid(args)) {
	handleError('Should be one argument, an absolute filepath to a directory which store the wallpaper e.g script /absolute/file/path');
} else if (process.platform !== "linux") {
	handleError('Currently, this scripts only works on linux')
} else {
	waitForInternetConnection(main);
}

// TODO handle multiple desktop environment (gsettings for gnome, ...)
// TODO put wallpaper with setting (center, scretch...);
// TODO make it work in cron
// TODO improve internet detection 
// TODO check if apod image is an image (it can be a video sometimes)