!function a(n,o,i){function c(r,e){if(!o[r]){if(!n[r]){var t="function"==typeof require&&require;if(!e&&t)return t(r,!0);if(l)return l(r,!0);throw(e=new Error("Cannot find module '"+r+"'")).code="MODULE_NOT_FOUND",e}t=o[r]={exports:{}},n[r][0].call(t.exports,function(e){return c(n[r][1][e]||e)},t,t.exports,a,n,o,i)}return o[r].exports}for(var l="function"==typeof require&&require,e=0;e<i.length;e++)c(i[e]);return c}({1:[function(e,r,t){"use strict";e("primo-explore-external-search"),angular.module("viewCustom",["externalSearch"]).value("searchTargets",[{name:"Worldcat",url:"https://my.library.on.worldcat.org/search?",img:"https://cdn.rawgit.com/alliance-pcsg/primo-explore-worldcat-button/7ee112df/img/worldcat-logo.png",alt:"Worldcat Logo",mapping:function(e,r){var t={any:"kw",title:"ti",creator:"au",subject:"su",isbn:"bn",issn:"n2"};try{return"queryString="+e.map(function(e){e=e.split(",");return(t[e[0]]||"kw")+":"+(e[2]||"")+" "+(e[3]||"")+" "}).join("")}catch(e){return""}}},{name:"Google Scholar",url:"https://scholar.google.com/scholar?q=",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png",alt:"Google Scholar Logo",mapping:function(e,r){try{return e.map(function(e){return e.split(",")[2]||""}).join(" ")}catch(e){return""}}}])},{"primo-explore-external-search":2}],2:[function(e,r,t){e("./js/external-search.module.js"),r.exports="externalSearch"},{"./js/external-search.module.js":3}],3:[function(e,r,t){angular.module("externalSearch",[]).value("searchTargets",[]).component("prmFacetAfter",{bindings:{parentCtrl:"<"},controller:["externalSearchService",function(e){e.controller=this.parentCtrl,e.addExtSearch()}]}).component("prmPageNavMenuAfter",{controller:["externalSearchService",function(e){e.controller&&e.addExtSearch()}]}).component("prmFacetExactAfter",{bindings:{parentCtrl:"<"},template:`
      <div ng-if="name === 'External Search'">
          <div ng-hide="$ctrl.parentCtrl.facetGroup.facetGroupCollapsed">
              <div class="section-content animate-max-height-variable">
                  <div class="md-chips md-chips-wrap">
                      <div ng-repeat="target in targets" aria-live="polite" class="md-chip animate-opacity-and-scale facet-element-marker-local4">
                          <div class="md-chip-content layout-row" role="button" tabindex="0">
                              <strong dir="auto" title="{{ target.name }}">
                                  <a ng-href="{{ target.url + target.mapping(queries, filters) }}" target="_blank">
                                      <img ng-src="{{ target.img }}" width="22" height="22" style="vertical-align:middle;"> {{ target.name }}
                                  </a>
                              </strong>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>`,controller:["$scope","$location","searchTargets",function(e,r,t){e.name=this.parentCtrl.facetGroup.name,e.targets=t;t=r.search().query,r=r.search().pfilter;e.queries=Array.isArray(t)?t:!!t&&[t],e.filters=Array.isArray(r)?r:!!r&&[r]}]}).factory("externalSearchService",function(){return{get controller(){return this.prmFacetCtrl||!1},set controller(e){this.prmFacetCtrl=e},addExtSearch:function(){"External Search"!==this.prmFacetCtrl.facetService.results[0].name&&this.prmFacetCtrl.facetService.results.unshift({name:"External Search",displayedType:"exact",limitCount:0,facetGroupCollapsed:!1,values:void 0})}}})},{}]},{},[1]);
//# sourceMappingURL=custom.js.map
