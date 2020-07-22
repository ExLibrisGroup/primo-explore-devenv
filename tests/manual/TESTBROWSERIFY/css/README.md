# The Primo New UI Customization Workflow Development Environment


## css documentation

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



## Recipes/Examples:


# css Recipe 1 - Color Scheme (Starting from August 2016 Release)

-  Open the `colors.json.txt` file in the root of your view folder
-  You will see a json object with our default color scheme:

    ```
    {
      "primary": "#53738C",
      "secondary" : "#A9CDD6",
      "backgroundColor" : "white",
      "links": "#5C92BD",
      "warning": "tomato",
      "positive": "#0f7d00",
      "negative": "gray",
      "notice": "#e08303"
    }    
    ```

-  Since November 2016 release - we are giving you the ability to easily customize the majority of the following
colors - primary, secondary, backgroundColor, links, warning, positive, negative, notice - just change the definition and save the file.

The colors are mapped to different elements in the user interface:

![Color Changes image](../../help_files/colors3.png "Color Changes")

-  Open a new command line window

-  cd to the project base directory (C:\**\**\primo-explore-devenv)
-  Run `gulp app-css --view <your-view/folder code>` for example:
        `gulp app-css --view Auto1`
- for Primo Ve customers add the --ve flag at the end of the command for example:
    `gulp app-css --view Auto1 --ve`
-  A new file will be created on your package css directory named: `app-colors.css`
-  This file will contain all of the primo-explore theme color definitions.
    We will continue to add more color definitions to extend this ability
- Refresh your browser to see the changes take affect
- For example, for the following `colors.json.txt` file:

```
{
  "primary": "#512DA8",
  "secondary" : "#D1C4E9",
  "backgroundColor" : "#BDBDBD",
  "links": "#009688",
  "warning": "#FF5722"
}


```

You will get:

 ![Color Changes image](../../help_files/colors1.png "Color Changes")

 ![Color Changes image](../../help_files/colors2.png "Color Changes")

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
prm-search > md-content.md-primoExplore-theme .main, prm-search > md-content.md-primoExplore-theme.main {
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

-  The result:


 ![Facets image](../../help_files/facets.png "Factes Changes")







