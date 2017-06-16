# The Primo New UI Customization Workflow Development Environment


##JavaScript documentation

- When you want to add functionality to your Primo installation you will be using Angular Directives.

- To learn more about directives see:
> https://docs.angularjs.org/guide/directive

- Primo uses external directives from the Angular-material framework:
> https://material.angularjs.org/latest/

- Those directives are tagged by a prefix : "md-"

- Primo also creates its own directives which are tagged by the "prm-" prefix.


Example:
```
    <header layout="column" layout-fill class="topbar-wrapper">
       <prm-topbar>
       </prm-topbar>

   <prm-search-bar (search-event)="prmSearch.onSearchBarSearchEvent()">
   </prm-search-bar>

          <md-progress-linear class="header-progress-bar animation-scale-up-down" md-mode="indeterminate" ng-show="prmSearch.searchInProgress">
          </md-progress-linear>

   </header>
```


- You can see in the example how we use :

1. An HTML5 tag - header
2. A Primo directive : prm-topbar , prm-search-bar.
3. An external material design directive : md-progress-bar :
> https://material.angularjs.org/latest/api/directive/mdProgressLinear



##Concept

- When You want to add your own JavaScript functionality - you will need to plug-in to placeholder Directives we added to the system.
- Those directive are added as the last child element for every Primo directive (defined by the `prm-` prefix)
- The placeholder directives are injected (as input) with the Controller of their parent, thus have access to the data model of the parent directive
- Use the examples below as starting points for your JavaScript plug-in directives
- Learn about Angular Directives to better understand the different abilities this workflow offers
> https://docs.angularjs.org/guide/directive



##Recipes/Examples:


# JavaScript Recipe 1 - a Static `hello world` html Message


-  Use the `showDirectives` (located in the root directory of this package is the showDirectives.txt file
, just add the content of the file as a bookmark to your browser) scriplet to identify the `prmSearchBarAfter` directive which you will plugin to
-  Edit the primo-explore/custom/js/custom.js file and add a component declaration for the `prmSearchBarAfter` directive

    ```
    app.component('prmSearchBarAfter', {


    });
    ```
-  Add the template property with your static message

    ```
    app.component('prmSearchBarAfter', {
        template: `<span style="margin-left: 40%;">Hello World</span>`

    });
    ```

-  Save and refresh your browser



# JavaScript Recipe 2 - a Dynamic Directive
-  Use the `showDirectives` scriplet to identify the `prmSearchBarAfter` directive which you will plugin to
-  Run the following command in your browsers' console tab:
```
    angular.reloadWithDebugInfo()
```
-  Focus on the `prmSearchBarAfter` directive
-  Run the following command in your browsers' console tab:
```
    angular.element($0).scope().ctrl
```

- Review the properties of the directive to decide which data elements can be used, avoid methods/functions as they wont be backwards compatible

- Edit  primo-explore/custom/js/custom.js file and add a component declaration for the `prmSearchBarAfter` directive

- Add a binding definition the input parentCtrl
```
    bindings: {parentCtrl: '<'},
```
- Add a controller definition:
```
    controller: 'SearchAfterController',
```
- Define a controller with 2 getter methods to return the query and selected scope
```
app.controller('SearchBarAfterController', [function () {
        var vm = this;

        vm.getSelectdScope = getSelectdScope;
        vm.getQuery = getQuery;

        function getSelectdScope() {
            return vm.parentCtrl.scopeField;
        }

        function getQuery() {
            return vm.parentCtrl.mainSearchField;
        }

```
-  Edit the directive template to reference the getter methods
``` <div layout="row" layout-align="center center">
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
  ```
-  Save and refresh your browser


# JavaScript Recipe 3 - Adding the Altmetrics Widget
-  Use the `showDirectives` scriplet to identify the `prmFullViewAfter` directive which you will plugin to
-  Run the following command in your browsers' console tab:
`angular.reloadWithDebugInfo()`
-  Focus on the `prmFullViewAfter` directive
-  Run the following command in your browsers' console tab:
`angular.element($0).scope().ctrl`

- Review the properties of the directive to decide which data elements can be used, avoid methods/functions as they wont be backwards compatible

- Edit  primo-explore/custom/js/custom.js file and add a component declaration for the `prmFullViewAfter` directive

- Add a binding definition the input parentCtrl
`bindings: {parentCtrl: '<'},`
- Add a controller definition:
`controller: 'FullViewAfterController',`
- Define a controller that populates the doi and loads the Altmetrics js file
```app.controller('FullViewAfterController', ['angularLoad', function (angularLoad) {
        var vm = this;
        vm.doi = vm.parentCtrl.item.pnx.addata.doi[0] || '';

        vm.$onInit = function () {
            angularLoad.loadScript('https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js?' + Date.now()).then(function () {

            });
        };
    }]);
```
- Edit the directive template to add the Altmetrics div and bind the data-doi attribure to the controller
```<div class="full-view-section-content" ng-if="$ctrl.doi">
                    <div class="section-header" layout="row" layout-align="center center">
                        <h2 class="section-title md-title light-text">
                            Social Popularity Statistics (AltMetrics) :
                        </h2>
                        <md-divider flex>
                        </md-divider>
                        </div>
                        <div class="full-view-section">
                           <div class="full-view-section-content">
                                <div class="section-body" layout="row" layout-align="center center">
                                    <div class="spaced-rows" layout="column">
                                        <div ng-if="$ctrl.doi" class="altmetric-embed" data-badge-type="medium-donut" data-badge-details="right" data-doi="{{$ctrl.doi}}">
                                        </div>
                                    </div>
                                </div>
                           </div>
                        </div>
                    </div>
   ```
-  Save and refresh your browser

