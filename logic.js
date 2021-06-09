const fs = require('fs');
const request = require('request');
const { getFilePath, handleError } = require('./utils');


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
    downloadWallpaper: downloadWallpaper,
	cacheExplanationFile: cacheExplanationFile,
	displayExplanation: displayExplanation,
}