app.component('myInstitutionComponent', {
    bindings: {parentCtrl: '<'},
    controller: 'MyInstitutionComponentController',
    template: `<div layout="row" layout-align="center center">
                         <md-card flex="80">
                         <md-card-title>
                             <md-card-title-text><span class="md-headline">
                             This is a demo presenting the ability to display query
                             information below the search box</span>
                             <span class="md-subhead">Query: {{$ctrl.getQuery()}}</span>
                             <span class="md-subhead">Scope: {{$ctrl.getSelectdScope()}}</span>
                             </md-card-title-text>
                             <md-card-title-media>
                             <div class="md-media-sm card-media"></div>
                             </md-card-title-media>
                         </md-card-title>
                         <md-card-actions layout="row" layout-align="end center">
                             <md-button>Action 1</md-button>
                             <md-button>Action 2</md-button>
                         </md-card-actions>
                         </md-card>
                     </div>
                    `
});





app.component('prmSearchBarAfter', {
    bindings: {parentCtrl: `<`},
    template: `<my-institution-component parent-ctrl="$ctrl.parentCtrl"></my-institution-component>`
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
