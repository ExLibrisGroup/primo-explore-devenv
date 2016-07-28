'use strict';

let css = require('css');
let fs = require('fs');

let file = './primo-explore/lib/app-edb918fbd4.css';
let cssContent = fs.readFileSync(file, {encoding: 'utf8'});
let obj = css.parse(cssContent,{source: file});




let colorRules = [];
for(let rule of obj.stylesheet.rules) {
    if(!rule.declarations) {
        continue;
    }
    let colorDeclarations = rule.declarations.filter(f => f.property && f.property.includes('color'));
    if(!colorDeclarations.length) {
        continue;
    }
    rule.declarations = colorDeclarations;
    colorRules.push(rule);
}

obj.stylesheet.rules = colorRules;

console.log(css.stringify(obj));