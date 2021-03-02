const fs = require('fs');
const request = require('request');
const { exec } = require("child_process");
const { getFilePath, handleError } = require('./utils');
const gsettingsBackground = 'gsettings set org.gnome.desktop.background picture-uri';
const gsettingsScreenSaver = 'gsettings set org.gnome.desktop.screensaver picture-uri';
const gsettingsOptionsBg = 'gsettings set org.gnome.desktop.background picture-options';
const gsettingsOptionsSs = 'gsettings set org.gnome.desktop.screensaver picture-options';

const options = {
	'--zoom': (isBoth) => isBoth ? `${gsettingsOptionsBg} 'zoom' && ${gsettingsOptionsSs} 'zoom'` : `${gsettingsOptionsBg} 'zoom'`,
	'--scaled': (isBoth) => isBoth ? `${gsettingsOptionsBg} 'scaled' && ${gsettingsOptionsSs} 'scaled'` : `${gsettingsOptionsBg} 'scaled'`,
	'--wallpaper': (isBoth) => isBoth ? `${gsettingsOptionsBg} 'wallpaper' && ${gsettingsOptionsSs} 'wallpaper'` : `${gsettingsOptionsBg} 'wallpaper'`,
	'--centered': (isBoth) => isBoth ? `${gsettingsOptionsBg} 'centered' && ${gsettingsOptionsSs} 'centered'` : `${gsettingsOptionsBg} 'centered'`,
	'--stretched': (isBoth) => isBoth ? `${gsettingsOptionsBg} 'stretched' && ${gsettingsOptionsSs} 'stretched'` : `${gsettingsOptionsBg} 'stretched'`,
	'--spanned': (isBoth) => isBoth ? `${gsettingsOptionsBg} 'spanned' && ${gsettingsOptionsSs} 'spanned'` : `${gsettingsOptionsBg} 'spanned'`
}


const getSetAsWallpaperCmd = (args) => {
	const fullPath = getFilePath();
	const isBoth = args.includes('--both');

	const wallpaperCmd = isBoth ? `${gsettingsBackground} file://${fullPath} && ${gsettingsScreenSaver} file://${fullPath}` : `${gsettingsBackground} file://${fullPath}`;
	const cmdOptions = getCmdOptions(args, isBoth);

	return cmdOptions ? `${wallpaperCmd} && ${cmdOptions}` : wallpaperCmd;
}

const getCmdOptions = (args, isBoth) => {
	let test = "";
	args.forEach((element) => {
		if (Object.keys(options).includes(element)) {
			test = options[element](isBoth)
		}
	})

	return test;
}

const setImageAsWAllpaper = (args) => {
	exec(getSetAsWallpaperCmd(args), (err, stdout, stderr) => {
		if (err) {
			handleError('Error while setting wallpaper as wallpaper', err);
			return;
		}

		const std = stdout || stderr;
		console.log(std);
	});
}

const downloadWallpaper = async (body) => {
	try {
		const data = JSON.parse(body);
		const imageUrl = data.thumbnail_url ? data.thumbnail_url : data.hdurl ? data.hdurl : data.url;
		const file = fs.createWriteStream(getFilePath());
		request.get(imageUrl).pipe(file);
	} catch (err) {
		handleError('Error while downloading the wallpaper', err);
	}
}

const cacheExplanationFile = (content) => {
	fs.writeFile(getFilePath(false), content, (err) => {
		// we doesn't throw the error because it's not vital for the program to store the data
		if (err) handleError("Fail to store the explanation data");
	});
}

const displayExplanation = (content) => {
	console.log(`${content.date} : ${content.title}`);
	console.log('\n');
	console.log(content.explanation);
}


module.exports = { 
    setImageAsWAllpaper: setImageAsWAllpaper,
    downloadWallpaper: downloadWallpaper,
	cacheExplanationFile: cacheExplanationFile,
	displayExplanation: displayExplanation,
}