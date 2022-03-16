// Gulp
const { watch, series, parallel, src, dest } = require('gulp');

//Scripts requires
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const stripDebug = require('gulp-strip-debug');
const order = require('gulp-order');

//Styles requires
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const stripCssComments = require('gulp-strip-css-comments');

//Tools and others requires
const fs = require('fs-extra');
const argv = require('minimist')(process.argv.slice(2));
const gulpif = require('gulp-if');
const del = require('del');
const fileSync = require('gulp-file-sync');
const log = require('fancy-log');
const colors = require('ansi-colors');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// Setup directories object
const dir = {
	input: 'src/',
	get inputScripts() { return this.input + 'scripts/'; },
	get inputStyles() { return this.input + 'scss/'; },
	get inputHtml() { return this.input + 'html/' },
	output: 'build/',
	get outputScripts() { return this.output + 'js/'; },
	get outputStyles() { return this.output + 'css/'; },
	get outputHtml() { return this.output + 'html/' },
}

// Autoprefixer options
const optAutoprefixer = {
	cascade: false,
	add: true,
	remove: true
}

const templates = {
	html : (names) => { return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="X-UA-Compatible" content="ie=edge">
			<link rel="stylesheet" href="css/${names.styles}.css">
			<title>Hello World!</title>
		</head>
		<body>

			<div id="${names.id}">
			</div>

			<script src="js/${names.scripts}.js"></script>
		</body>
		</html>
	`},
	appJs: (names) => { return `
		document.addEventListener('DOMContentLoaded', (event) => {
			//Initialize you modules here...
			MySingleton.init();
		})

		let MySingleton = (function() {
			const elm = document.getElementById('${names.id}');

			function setup(elm) {
				// your code goes here
				elm.innerHTML = "<h1>Hello world</h1>";
			}

			return {
				init: function() {
					if (elm) {
						setup(elm);
					} else {
						console.log(elm);
					}
				},
			}
		})();
	`},
	style: (names) => { return `
		@import "_parts/_base/variables";
		@import "_parts/_mixins/mixins";

		html,
		body {
			padding: 0;
			margin: 0;
		}

		body {
			font-family: Helvetica, sans-serif;
			font-size: 16px;
		}

		body * {
			box-sizing: border-box;
		}

		//Your scss goes bellow
		$ID : '${names.id}';

	`},
	variables: `
		// Colors
		$primary : magenta;
		$secondary : blue;
		$tertiary : orange;

		$error : red;
		$success : green;

		$black : black;
		$dark : #555;
		$light : #eee;
		$white : white;

		$maxWidth : '1440px';
		$mobileMax : '768px';
		$tabletMin : '769px';
		$laptopMin : '1024px';
		$desktopMin : '1440px';
	`,
	mixins: `
		// Import your mixins here
		@import "_parts/_mixins/breakpoints";
	`,
	breakpoints: `
	//@include media('mobile') { //css }
	@mixin media($media) {
		@if $media == 'mobile' {@media screen and (max-width: $mobileMax) {@content;} }
		@if $media == 'tablet' { @media screen and (min-width: $tabletMin) { @content; } }
		@if $media == 'laptop' { @media screen and (min-width: $laptopMin) { @content; } }
		@if $media == 'desktop' { @media screen and (min-width: $desktopMin) { @content; } }
	}
	`,
}

function help(cb) {
	log(colors.bgBlue.black(`You current source folder is set to: '${dir.input}' and your output to: '${dir.output}'`));
	log(colors.bgBlue.black(`To setup the project folder use the command: 'gulp setup'`));
	log(colors.bgBlue.black(`To build from the src use the command: 'gulp'`));
	log(colors.bgBlue.black(`To sync the files from the src use the command: 'gulp sync'`));
	log(colors.bgBlue.black(`To clear the output folder use the command: 'gulp clean'`));
	log(colors.bgBlue.black(`To watch the files from the src use the command: 'gulp watch'`));
	log(colors.bgBlue.black(`To create a new campaign use the command: 'gulp create --name="My01"'`));
	cb();
}

function setup(cb) {

	log(colors.dim.bgBlue.black(`Setting up the project folders for you...`));
	const dirs = [
		dir.input,
		dir.inputScripts,
		dir.inputStyles,
		dir.inputStyles + '_parts/',
		dir.inputStyles + '_parts/_base/',
		dir.inputStyles + '_parts/_mixins/',
		dir.inputHtml, dir.inputHtml + 'assets',
		dir.inputHtml + 'assets/images',
		dir.inputHtml + 'assets/scripts',
		dir.inputHtml + 'assets/stylesheets'
	];

	// Name variables
	const names = {
		styles : 'style',
		scripts : 'app',
		id : 'main',
	}

	log(colors.dim.bgRed.black(`Creating ${colors.bold.white(dirs.length)} folders in ${colors.bold.white(dir.input)}`));

	for (let i=0; i<dirs.length; i++) {
        const directory = dirs[i];
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
            log(colors.bgGreen.black(`Created ${directory} folder successfully!`));
        } else {
            log(colors.bgYellow.black(`Folder ${directory} already exists, no action taken!`));
        }
	}

	if (!fs.existsSync(dir.inputHtml + 'index.html')) {
        fs.outputFile(dir.inputHtml + 'index.html', templates.html(names), function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(colors.bgGreen.black(`Created base index.html file.`));
        });
    } else {
        log(colors.bgYellow.black(`index.html file already exists, no action taken!`));
	}

	if (!fs.existsSync(dir.inputScripts + 'app.js')) {
        fs.outputFile(dir.inputScripts + 'app.js', templates.appJs(names), function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(colors.bgGreen.black(`Created base app.js file.`));
        });
    } else {
        log(colors.bgYellow.black(`app.js file already exists, no action taken!`));
	}

	if (!fs.existsSync(dir.inputStyles + 'style.scss')) {
        fs.outputFile(dir.inputStyles + 'style.scss', templates.style(names), function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(colors.bgGreen.black(`Created base style.scss file.`));
        });
    } else {
        log(colors.bgYellow.black(`style.scss file already exists, no action taken!`));
	}

	if (!fs.existsSync(dir.inputStyles + '_parts/_base/_variables.scss')) {
        fs.outputFile(dir.inputStyles + '_parts/_base/_variables.scss', templates.variables, function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(colors.bgGreen.black(`Created base _variables.scss file.`));
        });
    } else {
        log(colors.bgYellow.black(`_variables.scss file already exists, no action taken!`));
	}

	if (!fs.existsSync(dir.inputStyles + '_parts/_mixins/_mixins.scss')) {
        fs.outputFile(dir.inputStyles + '_parts/_mixins/_mixins.scss', templates.mixins, function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(colors.bgGreen.black(`Created base _mixins.scss file.`));
        });
    } else {
        log(colors.bgYellow.black(`_mixins.scss file already exists, no action taken!`));
	}

	if (!fs.existsSync(dir.inputStyles + '_parts/_mixins/_breakpoints.scss')) {
        fs.outputFile(dir.inputStyles + '_parts/_mixins/_breakpoints.scss', templates.breakpoints, function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(colors.bgGreen.black(`Created base _breakpoints.scss file.`));
        });
    } else {
        log(colors.bgYellow.black(`_breakpoints.scss file already exists, no action taken!`));
    }

	cb();
}

function clean(cb) {
	log(colors.dim.bgRed.black(`Cleaning content of '${colors.bold.white(dir.output)}' folders...`));
	del(dir.output);
	cb();
}

function main(cb) {
	// if prod flag is found, change the output folder to 'dist/'
	if (argv.prod) {
		dir.output = 'dist/';
		log(colors.dim.bgRed.black(`You running Gulp in production mode...`));
	}

	log(colors.dim.bgBlue.black(`Your current output is set to: '${dir.output}'`));
	cb();
}

function syncFiles(cb) {
	fileSync(dir.inputHtml, dir.output, {
		recursive: true,
		ignore: ['js', 'css']
	})
	cb();
}

// Handle the scripts of the project
function scripts(cb) {

	log(colors.dim.bgBlue.black(`Compiling scripts to: '${colors.bold.white(dir.outputScripts)}' folder`));

	return src( dir.inputScripts + '**/*.js')
	.pipe(order([
		"scripts/**/!(app)*.js", //all other js files on folder but not the app.js
		"scripts/app.js" // this should be the the last file to be added so that you can initiate you modules on
	], { base: dir.input }))
	.pipe(babel({
		presets: ['@babel/preset-env']
	}))
	//.pipe(concat('app.js'))
	.pipe(gulpif(argv.prod, stripDebug()))
	.pipe(gulpif(argv.prod,minify({
		ext:{
            src:'-debug.js',
            min:'.js'
        }
	})))
	.pipe(dest(dir.outputScripts));
	cb();
}

function styles(cb) {

	log(colors.dim.bgBlue.black(`Compiling styles to: ${colors.bold.white(dir.outputStyles)} folder`));

	return src(dir.inputStyles + '**/*.scss')
	.pipe(gulpif(argv.prod, stripCssComments()))
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(autoprefixer(optAutoprefixer))
	.pipe(dest(dir.outputStyles));
	cb();
}

function watcher(cb) {

	log(colors.dim.bgBlue.black(`Watching for changes on: '${colors.bold.white(dir.input)}' folder`));

	watch(dir.inputScripts + '**/*.js', scripts);
	watch(dir.inputStyles + '**/*.scss', styles);
	watch(dir.inputHtml + '**/*', syncFiles);

	if (argv.live) {
		watch(dir.output, reload);
	}

	cb();
}

function createTemplate(cb) {
	if ( argv.name ) {

		const names = {
			styles : argv.name + '-style',
			scripts : argv.name + '-script',
			id : argv.name,
		}

		if (!fs.existsSync(dir.inputHtml + argv.name + '.html')) {
			fs.outputFile(dir.inputHtml + argv.name + '.html', templates.html(names), function (err) {
				if (err && err.code != 'EEXIST') return console.error(err)
				log(colors.bgGreen.black(`Created base ${argv.name}.html file.`));
			});
		} else {
			log(colors.bgYellow.black(`${argv.name}.html file already exists, no action taken!`));
		}

		if (!fs.existsSync(dir.inputScripts + argv.name + '-script.js')) {
			fs.outputFile(dir.inputScripts + argv.name + '-script.js', templates.appJs(names), function (err) {
				if (err && err.code != 'EEXIST') return console.error(err)
				log(colors.bgGreen.black(`Created base ${argv.name}-script.js file.`));
			});
		} else {
			log(colors.bgYellow.black(`${argv.name}-script.js file already exists, no action taken!`));
		}
	
		if (!fs.existsSync(dir.inputStyles + argv.name + '-style.scss')) {
			fs.outputFile(dir.inputStyles + argv.name + '-style.scss', templates.style(names), function (err) {
				if (err && err.code != 'EEXIST') return console.error(err)
				log(colors.bgGreen.black(`Created base ${argv.name}-style.scss file.`));
			});
		} else {
			log(colors.bgYellow.black(`${argv.name}-style.scss file already exists, no action taken!`));
		}

	} else {
		log(colors.dim.bgRed.black(`To create a new template file you must provide a name with:`)+colors.dim.bgWhite.black(` gulp create --name="MY001"`));
	}
	cb();
}

if (argv.live) {
	browserSync.init({
		server: {
            baseDir: "./build"
        },
		notify: true
	});
}

exports.help = help;
exports.setup = series(main, setup, parallel(syncFiles,styles, scripts));
exports.default = series(main,parallel(syncFiles,styles, scripts));
exports.sync = syncFiles;
exports.clean = series(clean, syncFiles,styles, scripts);
exports.watch = series(main, parallel(syncFiles,styles, scripts), watcher);
exports.create = series(main, setup, createTemplate, parallel(syncFiles,styles, scripts), watcher);