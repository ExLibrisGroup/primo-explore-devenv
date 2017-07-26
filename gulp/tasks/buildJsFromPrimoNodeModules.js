"use strict";

let config = require("../config.js");
let del = require("del");
let execSync = require('child_process').execSync;
let gulp = require("gulp");
let gutil = require("gulp-util");
let runSequence = require("run-sequence");

gulp.task("reinstall-primo-node-modules", function() {
	if (config.getReinstallNodeModules()) {
		runSequence(["delete-primo-node-modules", "install-primo-node-modules"]);
	}
});

gulp.task("delete-primo-node-modules", function() {
	gutil.log("Starting deletion of the view package's primo explore related node modules.");

	del.sync([
		config.buildParams.customNpmModuleRootDir() + "/primo-explore*"
	]);

	gutil.log("Finished deletion of the view package's primo explore related node modules.");
});

gulp.task("install-primo-node-modules", function() {
	gutil.log("Starting re-installation of the view package's node modules using >npm install< command.");

	execSync('npm install', {
		cwd: config.buildParams.viewRootDir()
	}, function(error, stdout, stderr) {
		if (error) {
			gutil.log(error);
		}

		if (stdout) {
			gutil.log(stdout);
		}

		if (stderr) {
			gutil.log(stderr);
		}
	});

	gutil.log("Finished re-installation of the view package's node modules using >npm install< command.");
});
