const fs = require('fs');
const path = require('path');
const fileName = "wallpaper.jpg";
const { exec } = require("child_process");

const getFullPath = (argPath) => {
	let filePath = argPath;
	if (argPath.substr(argPath.length - 1) !== "/") {
		filePath += "/";
	}

	return filePath+fileName;
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

const areArgsValid = (args) => {
    return (args.length !== 1 || !path.isAbsolute(args[0]) || !fs.lstatSync(args[0]).isDirectory());
}

module.exports = { 
	getFullPath: getFullPath,
	handleError: handleError,
	waitForInternetConnection: waitForInternetConnection,
	areArgsValid: areArgsValid
}