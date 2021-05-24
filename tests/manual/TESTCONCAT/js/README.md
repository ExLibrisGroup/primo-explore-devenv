# The Primo New UI Customization Workflow Development Environment


## JavaScript documentation

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



## Concept

- When You want to add your own JavaScript functionality - you will need to plug-in to placeholder Directives we added to the system, by creating your own placeholder Directive.
- Those directives are added as the last child element for every Primo directive (defined by the `prm-` prefix)
- The placeholder directives are injected (as input) with the Controller of their parent, thus have access to the data model of the parent directive
- Use the examples below as starting points for your JavaScript plug-in directives
- Learn about Angular Directives to better understand the different abilities this workflow offers
> https://docs.angularjs.org/guide/directive



## Recipes/Examples:

# Note:

The examples below use the back tic '`' for templates - which will work using babel (Documentation on how to do so will be shared)
This causes the examples to fail on IE11 browsers.

To solve this you can replace the '`' with regular apostrophe ("'") and use a single line template (less readable but works just as well).




# JavaScript Recipe 1 - a Static `hello world` html Message


-  Use the `showDirectives` (located in the root directory of this package is the showDirectives.txt file
, just add the content of the file as a bookmark to your browser) scriplet to identify the `prmSearchBarAfter` directive which you will plugin to


![Show Directives image](../../help_files/showDirectives.png "Show Directives Changes")

-  Edit the primo-explore/custom/js/custom.js file and add a component declaration for `myInstitutionComponent` and a component declaration 
for the `prmSearchBarAfter` directive

    ```
    app.component('myInstitutionComponent', {
    
    
    });
    
    app.component('prmSearchBarAfter', {


    });
    ```
-  Add the template property with your static message

    ```
    app.component('myInstitutionComponent', {
        template: `<span style="margin-left: 40%;">Hello World</span>`
    });
    ```
-  Add the template property with your component template (myInstitutionComponent) 
    
    ```
    app.component('prmSearchBarAfter', {
            bindings: {parentCtrl: `<`},
            template: `<my-institution-component></my-institution-component>`    
    });
    ```
        

-  Save and refresh your browser

![Hello World image](../../help_files/js1.png "Hello World  Changes")

# JavaScript Recipe 2 - a Dynamic Directive
-  Use the `showDirectives` scriplet to identify the `prmSearchBarAfter` directive which you will plugin to
-  Run the following command in your browsers' console tab:
```
    angular.reloadWithDebugInfo()
```
-  Focus on the `prmSearchBarAfter` directive

![Focus image](../../help_files/js2.png "Focus")

-  Run the following command in your browsers' console tab:
```
    angular.element($0).scope().$ctrl (angular.element($0).scope().ctrl in version earlier than February 2017)
```

- Review the properties of the directive to decide which data elements can be used, avoid methods/functions as they wont be backwards compatible

![properties image](../../help_files/js3.png "properties")


- Edit  primo-explore/custom/js/custom.js file and add: a component declaration for the `prmSearchBarAfter` directive, and a component declaration for the `myInstitutionComponent`

- Add a binding definition the input parentCtrl for both components
```
    bindings: {parentCtrl: '<'},
```
- Add a controller definition for the `myInstitutionComponent` component:
```
    controller: 'MyInstitutionComponentController',
```
- Define a controller with 2 getter methods to return the query and selected scope
```
app.controller('MyInstitutionComponentController', [function () {
        var vm = this;


        vm.getSelectdScope = getSelectdScope;
        vm.getQuery = getQuery;


        function getSelectdScope() {
            return vm.parentCtrl.scopeField;
        }

        function getQuery() {
            return vm.parentCtrl.mainSearchField;
        }
    }]);

```
-  Edit the `prmSearchBarAfter` directive template to reference the `myInstitutionComponent`
```
template: `<my-institution-component parent-ctrl="$ctrl.parentCtrl"></my-institution-component>`
``` 
-  Edit the `myInstitutionComponent` directive template to reference the getter methods
```
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
                     </div>`

  ```
-  Save and refresh your browser

![dynamic example image](../../help_files/js4.png "dynamic example")

# JavaScript Recipe 3 - Adding the Altmetrics Widget
-  Use the `showDirectives` scriplet to identify the `prmFullViewAfter` directive which you will plugin to

![Altmetrics example image](../../help_files/js5.png "Altmetrics example")

-  Run the following command in your browsers' console tab:
`angular.reloadWithDebugInfo()`
-  Focus on the `prmFullViewAfter` directive
-  Run the following command in your browsers' console tab:
`angular.element($0).scope().ctrl`

- Review the properties of the directive to decide which data elements can be used, avoid methods/functions as they wont be backwards compatible

![Altmetrics example 2 image](../../help_files/js6.png "Altmetrics 2 example")

- Edit  primo-explore/custom/js/custom.js file and add: a component declaration for the `prmFullViewAfter` directive, and a component declaration for the `myInstitutionComponent`

- Add a binding definition the input parentCtrl for both components
```
    bindings: {parentCtrl: '<'},
```
- Add a controller definition for the `myInstitutionComponent` component:
```
    controller: 'MyInstitutionComponentController',
```
- Define a controller that populates the doi and loads the Altmetrics js file
```
app.controller('MyInstitutionComponentController', ['angularLoad', function (angularLoad) {
        var vm = this;
        vm.doi = vm.parentCtrl.item.pnx.addata.doi[0] || '';

        vm.$onInit = function () {
            angularLoad.loadScript('https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js?' + Date.now()).then(function () {

            });
        };
    }]);
```
-  Edit the `prmFullViewAfter` directive template to reference the `myInstitutionComponent`
```
template: `<my-institution-component parent-ctrl="$ctrl.parentCtrl"></my-institution-component>`
``` 
- Edit the `myInstitutionComponent` directive template to add the Altmetrics div and bind the data-doi attribute to the controller
```
app.component('myInstitutionComponent', {
        bindings: {parentCtrl: '<'},
        controller: 'MyInstitutionComponentController',
        template: `<div class="full-view-section loc-altemtrics" flex-md="65" flex-lg="65" flex-xl="65" flex>
                    <div class="layout-full-width full-view-section-content" ng-if="$ctrl.doi">
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
                    </div>`
    });
   ```

-  Edit the custom1.css file and add the following definitions:

 ```
 .full-view-section.loc-altemtrics{
     background-color: #f3f3f3;
     margin-top:0px;
     padding-left: 3em;
 }
 ```

-  Save and refresh your browser

![Altmetrics example 3 image](../../help_files/js7.png "Altmetrics 3 example")
