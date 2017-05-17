var fsx = require('fs-extra');



const minimist = require('minimist');


var options = minimist(process.argv.slice(2));

fsx.ensureDirSync(options.to);
fsx.copy(options.from, options.to, err => {console.log('Error: '+err)})
/*fsx.copy('111', 'tasks/111', err => {console.log('222'+err)})*/
// fsx.copy('./node_modules/primo-explore-devenv/primo-explore/primo-explore-location-item-after', '/tmp/mynewdir', err => {})
