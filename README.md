This package purpose is to allow you to set the actual APOD image as your wallpaper. It works on every desktop system (Linux, MacOs and Windows)

Install it with

`sudo npm install -g apodwallpaper`

You need to define an env variable named *APOD_WALLPAPER*, this variable must be an absolute path to a directory (the one you want to store to wallpaper image)

You run the script like this

`APOD_WALLPAPER="absolute/path" apod-wallpaper set`

the *set* argument set the APOD as your computer wallpaper

You can also get the explanation about the APOD 

`APOD_WALLPAPER="absolute/path" apod-wallpaper explain`

This will print the explanation

This project use CommonJs module for a better NodeJs compatibility
