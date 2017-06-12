************************************************************************************************************************

                                    Primo Configuration Package  - CSS Guide

************************************************************************************************************************


Primo uses Angular Directives massively in this project

To learn more about directives see:     https://docs.angularjs.org/guide/directive

Primo uses external directives from the Angular-material framework  : https://material.angularjs.org/latest/

Those directives are tagged by a prefix : "md-"

Primo also creates its own directives which are tagged by the "prm-" pefix.


Example:

    <header layout="column" layout-fill class="topbar-wrapper">
    	<prm-topbar></prm-topbar>

		<prm-search-bar (search-event)="prmSearch.onSearchBarSearchEvent()"></prm-search-bar>

		<!-- Progress bar / loader -->
   		<md-progress-linear class="header-progress-bar animation-scale-up-down" md-mode="indeterminate" ng-show="prmSearch.searchInProgress"></md-progress-linear>
	</header>


You can see in the example how we use :

1. HTML5 tag - header
2. A Primo directive : prm-topbar , prm-search-bar.
3. An external material design directive : md-progress-bar : https://material.angularjs.org/latest/api/directive/mdProgressLinear



When defining css rules it is important to understand the css cascading/specifity logic:

http://www.w3.org/TR/css3-cascade/

https://specificity.keegan.st/




When you start working on customizing your css be aware of the ability to define css selectors based on the directive name - which is actually equivalent
to an html tag - this will enable you changing the design of a component cross-system without relying on id's/classes

For the example above we can define selectors:

prm-topbar input {....}
prm-topbar.md-primoExplore-theme input {....}

Primo is using a theme inside angular-material to define a palette of colors see: https://material.angularjs.org/latest/Theming/01_introduction


This means that you will often encounter a class "md-primoExplore-theme" attached to  elements.


inside the OTB custom1.css file you will find examples of common css changes that can be commented out and used







