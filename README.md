This package purpose is to allow you to set the actual APOD image as your wallpaper. This package only works on linux system with a gnome base desktop environment.
You can make pull request to make it works on other desktop system (cinnamon, kde...)

Install it with

`sudo npm install -g apodwallpaper`

You need to define an env variable named *APOD_WALLPAPER*, this variable must be an absolute to a directory (the one you want to store to wallpaper image)

You run the script like this

`APOD_WALLPAPER="absolute/path" apod-wallpaper set --both --zoom`

the *set* argument set the APOD as your computer wallpaper, *--zoom* is a style option (it's the gnome wallpaper option (centered, scaled, stretched...))

You can also get the explanation about the APOD 

`APOD_WALLPAPER="absolute/path" apod-wallpaper explain`

This will print the explanation