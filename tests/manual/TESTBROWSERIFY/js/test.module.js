                angular
                    .module('testModule', [])
                    .factory('testModuleService', [
                        function () {
                            var svc = {};
                            svc.manipulate = function (str) {
                                return str.split("").reverse().join("");
                            };
                            return svc;
                        },
                    ])
                    .controller('testModuleController', [
                        'testModuleService',
                        function (testModuleService) {
                            var vm = this;
                            vm.getSelectdScope = function() {
                                return testModuleService.manipulate(vm.prmSearchBar.scopeField);
                            }

                            vm.getQuery = function() {
                                return vm.prmSearchBar.mainSearchField;
                            }
                        },
                    ])
                    .component('testComponent', {
                        require: {
                            prmSearchBar: '^prmSearchBar',
                        },
                        controller: 'testModuleController',
                        template:
                            `<div layout="row" layout-align="center center">
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
                            </div>`,
                    });
