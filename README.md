# Fast Campaign Startup with Gulp

Hit the ground running with this campaign startup with all the tools you need to start developing web pages/banners/sections in no time.
*I developed this to help me save time, and this tool was built with my workflow in mind so feel free to modify it to fit your workflow needs

## Dependencies

- [nodejs](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [gulp](https://gulpjs.com/)
- [sass](https://sass-lang.com/dart-sass)

## Installation

To install this just run `git clone https://github.com/MarioDuarte/campaign-project-startup.git` followed by `cd Campaign-Project-Startup`, once you are at the root directory of you project just run `npm install` to install all dependencies.

## Setup

After the installation process is done you can go ahead and run `gulp setup`, this will perform the following:

- set up working tree
- create base template files
- run the compilers for the first time

Running the command with the `--prod` flag will run the same as the above but compile all the code to the set production folder.

### Tree structure

The setup process will generate the following tree structure:
```
	├── Root
	|	├── dist (if ran with --prod flag)
	|	|	├── css
	|	|	|	└── style.css
	|	|	├── js
	|	|	|	└── app.js
	|	|	└── index.html
	|	├── build
	|	|	├── css
	|	|	|	└── style.css
	|	|	├── js
	|	|	|	└── app.js
	|	|	└── index.html
	|	├── src
	|	|	├── html
	|	|	|	├── assets
	|	|	|	|	├── images
	|	|	|	|	├── scripts (scripts vendor folder)
	|	|	|	|	└── stylesheets (styles vendor folder)
	|	|	|	└── index.html
	|	|	├── scripts
	|	|	|	└── app.js
	|	|	├── scss
	|	|	|	├── _parts
	|	|	|	|	├── _base
	|	|	|	|	|	└── _variables.scss
	|	|	|	|	├── _mixins
	|	|	|	|	|	└── _mixins.scss
	|	|	|	|	|	└──_breakpoints.scss
	|	|	|	|	└── style.scss
	|	├── .browserlistrc
	|	├── .editorconfig
	|	├── .gitignore
	|	├── Gulpfile.js
	|	├── Package-json
	|	└── README.md
```

### Tasks
Bellow is a list of tasks available:

#### - `gulp help`
This will display a list of tasks in gulp and how to use them

#### - `gulp setup`
This will run the setup process, creating the working tree structure and running the compilers for the first time

#### - `gulp`
This will run the compilers for the Sass and javascript once, synchronizing the files between `src` and `dist/build`.
You can run this task with the `--live` flag to run it with browser sync enabled.

#### - `gulp sync`
This will synchronize the files from `src` to `dist/build`, this only syncs files in one direction from `src`.

#### - `gulp clean`
This will clean the contents of the `build/dist` folder running the standard gulp task afterwards.

#### - `gulp watch`
This will watch for changes in the `src` folder, and run the tasks depending on the file type that has changed.
You can run this task with the `--live` flag to run it with browser sync enabled.

#### - `gulp create`
This will create a set of campaign files in the `src` folder, and run all the tasks associated with the `gulp task`.
This task will require you to run it with the `--name=""` flag, please make sure that you provide a name for your campaign, all file names will use this so ensure that is unique.
You can run this task with the `--live` flag to run it with browser sync enabled.