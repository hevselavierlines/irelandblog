# Ireland Blog

A vue project for a travel blog especially about Ireland but it can be used for any other region. 

## Features:

* Blog entries in a list with picture lightbox
* Map with the blog location
* Calendar with the blog dates
* Modal view for the blog entry for the map and calenar tab
* Auto reload for new blog entries 

## Installation

Download the project
<code>Run ```npm install```</code>
Create your own firebase configuration at firebase.google.com and add the file firebase.config.js
This file shall contain:

<code>
var config = {
    ...
};//configuration data from the firebase.google.com website.

export default config;
</code>

Important information for the contribute.vue!
This is only for the administrator so it should not be accessible from the outside. Later this will be done in an iOS or Android app.

Set up a PHP server with the file in server/blogimage.php
Modify the file contribute.vue
<code>
 IMAGE_SERVER: 'http://www.appc.at/irishblog/blogimage.php'
</code>
Put your url to the php file here. This is only needed for uploads. 

## Configuration

See webpack.config.dev.js for development and webpack.config.prod.js for production settings. 

## Usage

Run the gulp with the command
<code>
gulp dev
</code>


## Deployment

add ```--deploy``` to every gulp task to run it in deployment mode.

To build everything for deployment run:
 
```gulp --deploy```
