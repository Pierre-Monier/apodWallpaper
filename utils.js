const fs = require('fs');
const path = require('path');
const { exec } = require("child_process");

const imageFileName = "wallpaper.jpg";
const explanationFileName = ".explanation.json";
const gsettings = 'gsettings set org.gnome.desktop.background picture-uri';

const getFilePath = (isImage = true) => {
	const fileName = isImage ? imageFileName : explanationFileName;
	let filePath = process.env.APOD_WALLPAPER;
	if (filePath.substr(filePath.length - 1) !== "/") {
		filePath += "/";
	}

	return filePath + fileName;
}

const handleError = (message, err) => {
	console.error(message);
	if (err) {
		console.error(err)
	}
	process.exit(1);
}

const waitForInternetConnection = async (cb) => {
	console.log("checking internet connexion");
	try {
		exec('ping -c 1 8.8.8.8', function(err, stdout, stderr){
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

const isSettingAsWallaper = (args) => {
    return (args.length === 1 && args[0] === "set" && path.isAbsolute(process.env.APOD_WALLPAPER) && fs.lstatSync(process.env.APOD_WALLPAPER).isDirectory());
}

const isAskingExplaination = (args) => {
	return (args.length === 1 && args[0] === "explain");
}

const getExplanationCachedFile = async () => {
	try {
		const explanation = require(getFilePath(false));
		const currentDate = new Date().toISOString().split('T')[0];

		return (explanation.date !== currentDate) ? false : explanation;
	} catch {
		return false;
	}
}

const getCmd = () => {
	const fullPath = getFilePath();
	return `${gsettings} file://${fullPath}`;
}

module.exports = {
	getFilePath: getFilePath,
	handleError: handleError,
	waitForInternetConnection: waitForInternetConnection,
	isSettingAsWallaper: isSettingAsWallaper,
	isAskingExplaination: isAskingExplaination,
	getExplanationCachedFile: getExplanationCachedFile,
	getCmd: getCmd
}