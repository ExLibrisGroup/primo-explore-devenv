(function(){
"use strict";
'use strict';

var app = angular.module('viewCustom', ['angularLoad']);

app.service('TestService', [function () {
    var vm = this;

    vm.manipulate = manipulate;

    function manipulate(str) {
        return str.split("").reverse().join("");
    }
}]);

app.component('myInstitutionComponent', {
    bindings: { parentCtrl: '<' },
    controller: 'MyInstitutionComponentController',
    template: '<div layout="row" layout-align="center center">\n                         <md-card flex="80">\n                         <md-card-title>\n                             <md-card-title-text><span class="md-headline">\n                             This is a demo presenting the ability to display query\n                             information below the search box</span>\n                             <span class="md-subhead">Query: {{$ctrl.getQuery()}}</span>\n                             <span class="md-subhead">Scope: {{$ctrl.getSelectdScope()}}</span>\n                             </md-card-title-text>\n                             <md-card-title-media>\n                             <div class="md-media-sm card-media"></div>\n                             </md-card-title-media>\n                         </md-card-title>\n                         <md-card-actions layout="row" layout-align="end center">\n                             <md-button>Action 1</md-button>\n                             <md-button>Action 2</md-button>\n                         </md-card-actions>\n                         </md-card>\n                     </div>\n                    '
});

app.component('prmSearchBarAfter', {
    bindings: { parentCtrl: '<' },
    template: '<my-institution-component parent-ctrl="$ctrl.parentCtrl"></my-institution-component>'
});

app.controller('MyInstitutionComponentController', ['TestService', function (testService) {
    var vm = this;

    vm.getSelectdScope = getSelectdScope;
    vm.getQuery = getQuery;

    function getSelectdScope() {
        return testService.manipulate(vm.parentCtrl.scopeField);
    }

    function getQuery() {
        return vm.parentCtrl.mainSearchField;
    }
}]);
})();