const fs = require('fs');
const request = require('request');
const { exec } = require("child_process");
const { getCmd } = require('./cmd');
const { getFullPath, handleError } = require('./utils');

const setImageAsWAllpaper = (argPath) => {
	exec(getCmd(argPath), (err, stdout, stderr) => {
		if (err) {
			handleError('Error while setting wallpaper as wallpaper', err);
			return;
		}

		const std = stdout || stderr;
		console.log(std);
	});
}

const downloadWallpaper = async (body, argPath) => {
	try {
		const imageUrl = JSON.parse(body).url;
		const file = fs.createWriteStream(getFullPath(argPath));
		request.get(imageUrl).pipe(file);
	} catch (err) {
		handleError('Error while downloading the wallpaper', err);
	}
}

module.exports = { 
    setImageAsWAllpaper: setImageAsWAllpaper,
    downloadWallpaper: downloadWallpaper
}