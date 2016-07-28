'use strict';
var through = require('through2');
var applySourceMap = require('vinyl-sourcemaps-apply');
let findIndex = require('lodash/findIndex');


module.exports = function(options) {

    function transform(file, encoding, callback) {
        options = options || {};
        // generate source maps if plugin source-map present
        if (file.sourceMap) {
            options.makeSourceMaps = true;
        }

        // do normal plugin logic
        var result = myTransform(file.contents, options);
        file.contents = new Buffer(result.code);

        // apply source map to the chain
        // if (file.sourceMap) {
        //     applySourceMap(file, result.map);
        // }

        this.push(file);
        callback();
    }

    return through.obj(transform);
};

function myTransform(contents, options) {
    let stringArr = contents.toString('utf8').split("\n");
    let ind1 = findIndex(stringArr,(e) => e.includes('/* primary color hook */'));
    let ind2 = findIndex(stringArr,(e) => e.includes('/* primary color hook end*/'));
    let colors = stringArr.splice(ind1, ind2 - ind1 + 1);
    let newContent;
    if(options.colors) {
        newContent = colors.join("\n");
    }
    else {
        newContent = stringArr.join("\n");

    }
    return {
        code: newContent
    };

}