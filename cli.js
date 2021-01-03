#!/bin/env node
const request = require('request');
const fs = require('fs');
const path = require('path');
const { exec } = require("child_process");

const url = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";
const gsettings = 'gsettings set org.gnome.desktop.background picture-uri';
const fileName = "wallpaper.jpg";

const [,, ...args] = process.argv;

const main = () => {
	request(url, async (err, res, body) => {
		if (err) {
			handleError('Error while fetching data', err);
		}
	
		if (res.statusCode === 200) {
			await downloadWallpaper(body);
			setImageAsWAllpaper();
		} else {
			handleError(`Error, Response send with status code ${res.statusCode}`);
		}
	})
}

const setImageAsWAllpaper = () => {
	exec(getCmd(), (error, stdout, stderr) => {
		if (error) {
			handleError('Error while setting wallpaper as wallpaper', err);
			return;
		}

		const std = stdout || stderr;
		console.log(std);
	});
}

const downloadWallpaper = async (body) => {
	try {
		const imageUrl = JSON.parse(body).url;
		const file = fs.createWriteStream(getFullPath());
		request.get(imageUrl).pipe(file);
	} catch (err) {
		handleError('Error while downloading the wallpaper', err);
	}
}

const waitForInternetConnection = async (cb) => {
	console.log("checking internet connexion");
	try {
		child = exec('ping -c 1 8.8.8.8', function(err, stdout, stderr){
			if (err) {
			    console.log("Not available")
				waitForInternetConnection();
			} else {
			    console.log("Available")
			    cb();
			}
		});
	} catch (err) {
		handleError('Error while checking internet connection', err);
	}
}

const getCmd = () => {
	const fullPath = getFullPath();
	return `${gsettings} file://${fullPath}`;
}

getFullPath = () => {
	let filePath = args[0];
	if (args[0].substr(args[0].length - 1) !== "/") {
		filePath += "/";
	}

	return filePath+fileName;
}

const handleError = (message, err) => {
	console.error(message);
	if (err) {
		console.log(err)
	}
	process.exit(1);
}

if (args.length !== 1 || !path.isAbsolute(args[0]) || !fs.lstatSync(args[0]).isDirectory()) {
	handleError('Should be one argument, an absolute filepath to a directory which store the wallpaper e.g script /absolute/file/path');
} else {
	waitForInternetConnection(main);
}

// TODO handle multiple desktop environment
// TODO put wallpaper with setting (center, scretch...);
// TODO make it work in cron
// TODO improve internet detection 