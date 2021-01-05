const { getFullPath } = require('./utils');
const gsettings = 'gsettings set org.gnome.desktop.background picture-uri';

const getCmd = (argPath) => {
	const fullPath = getFullPath(argPath);
	return `${gsettings} file://${fullPath}`;
}

module.exports = { 
    getCmd: getCmd
}