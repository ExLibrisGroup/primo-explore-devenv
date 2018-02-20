# The Primo New UI Customization Workflow Development Environment


##css documentation

- Primo uses Angular Directives massively in this project

- To learn more about directives see:
> https://docs.angularjs.org/guide/directive

- Primo uses external directives from the Angular-material framework  :
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



- When defining css rules it is important to understand the css cascading/specifity logic:

> http://www.w3.org/TR/css3-cascade/

> https://specificity.keegan.st/




- When you start working on customizing your css be aware of the ability to define css selectors based on the directive name, which is actually equivalent
to an html tag - this will enable you changing the design of a component cross-system without relying on id's/classes

- For the example above we can define selectors:

```
prm-topbar input {....}
prm-topbar.md-primoExplore-theme input {....}
```
- Primo is using a theme inside angular-material to define a palette of colors see:
> https://material.angularjs.org/latest/Theming/01_introduction


- This means that you will often encounter a class "md-primoExplore-theme" attached to  elements.



##Recipes/Examples:


# css Recipe 1 - Color Scheme

-  Open a new command line window

-  cd to the project base directory (C:\**\**\primo-explore-devenv)
-  Run `gulp css-colors` to save the OTB css file
-  Run `css-color-extractor primo-explore/tmp/app.css --format=css  > primo-explore/tmp/colors.css` to extract the color definitions from the OTB css file and copy the css rules to primo-explore/custom/css/custom1.css


Run the following steps repeatedly until you are satisfied with the result


-  Choose a color from the interface (using your browsers' dev tools or extensions such as colorzilla)


-  Choose the new color from your library color scheme
-  Replace all values in the custom1.css file
-  Save and refresh your browser



# css Recipe 2 - Moving the Facets to the Left


-  Select the parent container containing the search result and the facets
-  Copy the selector definition using your browsers' dev tools
-  Define the container as
```
display:flex;
flex-flow:row-reverse;
```


- complete css definition:
```
prm-search > md-content.md-primoExplore-theme .main {
    display: -webkit-flex; !* Safari *!
    -webkit-flex-flow: row-reverse wrap; !* Safari 6.1+ *!
    display: flex;
    flex-flow: row-reverse wrap;

}
.screen-gt-sm .sidebar{
    webkit-flex: 0 0 15%;
    flex: 0 0 15%;
}
```
-  Save and refresh your browser









