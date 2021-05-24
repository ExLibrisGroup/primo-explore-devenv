require('./test.module.js');
//module.exports = 'testModule';
angular
    .module("viewCustom", ["testModule"])
    .component("prmSearchBarAfter", {
        template:
            '<test-component></test-component>'
    });
