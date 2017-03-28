# hue-workflow

A gulp workflow including Webpack, Babel, SCSS and Nunjucks 

## Features:

* Webpack as JS bundler including CommonJunks plugin
* Vue.js and vue template support
* SCSS
* Nunjuck as template engine
* Auto reload server
* Development and production builds
* mocha tests

## Installation

Run ```npm install```

## Configuration

See webpack.config.dev.js for development and webpack.config.prod.js for production settings. 

## Usage

Put any files in the corresponding directories.
HTML/Nunjuck files go into the _templates_ dir.

```gulp``` runs all tasks without starting the server.

```gulp dev``` runs all tasks and starts the reload server.

Take a look into gulpfile.js to see the other tasks.

## Deployment

add ```--deploy``` to every gulp task to run it in deployment mode.

To build everything for deployment run:
 
```gulp --deploy```

## Test

Test cases can be added in the `/test` directory.

To run the tests execute `npm test`