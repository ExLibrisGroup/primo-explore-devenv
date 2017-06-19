(function () {
  "use strict";
  'use strict';


  var app = angular.module('viewCustom', ['angularLoad']);

  app.component('prmLogoAfter',{
  bindings: {parentCtrl: '<'},
  controller: 'prmLogoAfterController',
  template: `<div class="product-logo product-logo-local" layout="row" layout-align="start center" layout-fill id="banner" tabindex="0" role="banner">
  <a href="https://www.plymouth.ac.uk">
  <img class="logo-image" alt="{{(\'nui.header.LogoAlt\' | translate)}}" ng-src="{{$ctrl.getIconLink()}}"/>
  </a>
  </div>`
});  

app.controller('prmLogoAfterController', [function () {
  var vm = this;
  vm.getIconLink = getIconLink;
  function getIconLink() {
    return vm.parentCtrl.iconLink;
  }
}]);

})();

 
(function() {
  var x = document.createElement("script"); x.type = "text/javascript"; x.async = true;
  x.src = (document.location.protocol === "https:" ? "https://" : "http://") + "us.refchatter.net/js/libraryh3lp.js?310";
  var y = document.getElementsByTagName("script")[0]; y.parentNode.insertBefore(x, y);
})();

var c;

