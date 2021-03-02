#!/bin/env node
const request = require('request');
const { handleError, waitForInternetConnection, isSettingAsWallaper, isAskingExplaination, getExplanationCachedFile } = require('./utils');
const { downloadWallpaper, setImageAsWAllpaper, cacheExplanationFile, displayExplanation } = require('./logic');

const apiUrl = "https://api.nasa.gov/planetary/apod?api_key=xu6OTf9PpXlJW0LrFpCxXys55XtQKcHK80sQuVuW&thumbs=true";

const [,, ...args] = process.argv;

const setApodAsWallpaper = () => {
	request(apiUrl, async (err, res, body) => {
		if (err) {
			handleError('Error while fetching data', err);
		}
	
		if (res.statusCode === 200) {
			await downloadWallpaper(body)
			cacheExplanationFile(body);
			setImageAsWAllpaper(args)
		} else {
			handleError(`Error, Response send with status code ${res.statusCode}`);
		}
	})
}

const getApodExplanation = () => {
	// (check local no request if explanation of the day is cached
	getExplanationCachedFile()
		.then((response) => {
		if (response) {
			displayExplanation(response)
		} else {
			request(apiUrl, async (err, res, body) => {
				if (err) {
					handleError('Error while fetching data', err);
				}

				if (res.statusCode === 200) {
					cacheExplanationFile(body);
					displayExplanation(JSON.parse(body));
				} else {
					handleError(`Error, Response send with status code ${res.statusCode}`);
				}
			})
		}
	})
}

switch (true) {
	case process.platform !== "linux":
		handleError('Currently, this scripts only works on linux')
		break;

	case isSettingAsWallaper(args):
		// we wait for internet connection because if the user set this script on the cron reboot event
		// it might failed because the program doesn't has access to any network
		waitForInternetConnection(setApodAsWallpaper);
		break;

	case isAskingExplaination(args):
		// here we doesn't wait because the end user isn't going to automate this command
		getApodExplanation();
		break;

	default:
		console.log("Use 'set' to set APOD as wallpaper");
		console.log("Use 'explain' to get explanation about the APOD of the day");
		console.log("You need an env variable named APOD_WALLPAPER which is an absolute filepath to a directory which store the wallpaper");
		console.log('e.g APOD_WALLPAPER="/absolute/file/path" apod-wallpaper set | explain')
		console.log('You can specify option for the background, --both will set for screensaver and background, there is a lot other option, --zoom, --centered, --scaled ...(it match the gsettings option) ')
		break;
}

// TODO make it work in cron (very hard)
// TODO improve internet detection (maybe remove it ?)

// TODO handle multiple desktop environment (gsettings for gnome, ...)
