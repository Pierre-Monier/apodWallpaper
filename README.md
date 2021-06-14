This package purpose is to allow you to set the actual APOD image as your wallpaper. It works on every desktop system (Linux, MacOs and Windows)

Install it with

`sudo npm install -g apodwallpaper`

You need to define an env variable named _APOD_WALLPAPER_, this variable must be an absolute path to a directory (the one you want to store to wallpaper image). If you set it in permanent way (in your /etc/environment file in linux for example), you might need to reboot your computer to let node access this env variable

You run the script like this

`APOD_WALLPAPER="absolute/path" apod-wallpaper set`

You don't need to pass the env variable if you have set it in a permanet way.

the _set_ argument set the APOD as your computer wallpaper

You can also get the explanation about the APOD

`APOD_WALLPAPER="absolute/path" apod-wallpaper explain`

This will print the explanation

This project use CommonJs module for a better NodeJs compatibility
