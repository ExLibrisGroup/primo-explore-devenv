var app = app || angular.module(
  'viewCustom', ['angularLoad', 'hathiTrustAvailability', 'sendSms']
).constant(
  'nodeserver', "https://apiconnector.thirdiron.com/v1/libraries/72"
).config([
  '$sceDelegateProvider',
  'nodeserver',
  function ($sceDelegateProvider, nodeserver) {
    var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
    urlWhitelist.push(nodeserver + '**');
    $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
  }
]);

//console.log(iFrameSizer);
app.controller('prmLoginAlmaMashupAfterController',
               ['$http', '$scope', '$sce', function ($http, $scope, $sce) {
  $scope.sizeIframe = function () {
    iFrameResize({log:true,checkOrigin:false},'.mashup-iframe');
  }
  var mashScope;
  // Find the prm-alma-mashup scope.
  // This is a horrid hack, but I seen no alternatives.
  // There's no prm-alma-mashup-after to use.
  function traverse(node) {
    if (mashScope) return;
    if (node.$ctrl) {
      if (node.$ctrl.service) {
        if (node.$ctrl.service.linkElement && node.$ctrl.service.linkElement.category === 'Alma-E') {
          $scope.mashScope = node.$ctrl;
          return;
        }
      }
    }
    if (node.$$childHead) traverse(node.$$childHead)
    if (node.$$nextSibling) traverse(node.$$nextSibling)
  }
  traverse($scope.$root);

  const LINK_TEMPLATE = 'http://local-dev.northwestern.edu:3000/search/results/view_it_primo?url=';
  if ($scope.mashScope) {
    var mashLink = $scope.mashScope.service.linkElement.links[0].link;
    $scope.isLinkAvailable = false;
    if (mashLink  && typeof mashLink !== 'undefined') {
      $scope.mashLink = $sce.trustAsResourceUrl(
        LINK_TEMPLATE + encodeURIComponent(mashLink)
      );
      $scope.isLinkAvailable = true;
    }
  }
}]);

app.component('prmLoginAlmaMashupAfter', {
  controller: 'prmLoginAlmaMashupAfterController',
  template: `
  <div>Hello: {{mashLink}}
    <iframe class="mashup-iframe"
            iframe-onload="{{sizeIframe()}}"
            ng-src="{{mashLink}}"
            style="width: 100%; border: none; overflow: hidden; height: 199px;"
            ng-if="isLinkAvailable"
            id="iFrameResizer1"
            scrolling="no" />
  </div>
`
});

// Enhance No Results tile

app.controller('prmNoSearchResultAfterController', [function () {
  var vm = this;
  vm.getSearchTerm = getSearchTerm;
  function getSearchTerm() {
    return vm.parentCtrl.term;
  }
}]);

app.component('prmNoSearchResultAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'prmNoSearchResultAfterController',
  template: '<md-card class="default-card zero-margin _md md-primoExplore-theme"><md-card-title><md-card-title-text><span translate="" class="md-headline ng-scope">No records found.</span></md-card-title-text></md-card-title><md-card-content><p><span>There are no results matching your search: <i>{{$ctrl.getSearchTerm()}}</i>. Looking for a book? Try again searching items held at other libraries:</span></p><md-button class="md-raised md-button md-primoExplore-theme md-ink-ripple" href="http://www.worldcat.org/search?q={{$ctrl.getSearchTerm()}}" type="button" aria-label="Search WorldCat" style="margin-left:0;margin-right:0;"> <img src="custom/NULV3/img/worldcat-logo.png" width="22" height="22" alt="worldcat-logo" style="vertical-align:middle;"> Search WorldCat</md-button><p><span>Looking for an article? Try <strong><a href="http://scholar.google.com/scholar?hl=en&q={{$ctrl.getSearchTerm()}}">Google Scholar</a></strong></span>.</p><p><span translate="" class="bold-text ng-scope">Suggestions:</span></p><ul><li translate="" class="ng-scope">Make sure that all words are spelled correctly.</li><li translate="" class="ng-scope">Try a different search scope.</li><li translate="" class="ng-scope">Try different search terms.</li><li translate="" class="ng-scope">Try more general search terms.</li><li translate="" class="ng-scope">Try fewer search terms.</li></ul><p><strong><a href="http://www.library.northwestern.edu/research/ask-us/index.html">Contact a Research Librarian for Assistance</a></strong>.</p></md-card-content></md-card>'
});

//Add Interlibrary Loan links to My Account

app.component('prmLoansOverviewAfter', {
  bindings: {},
  template: '<div class="tiles-grid-tile"><div class="tile-content layout-column" layout="column"><div class="tile-header layout-column" layout="column"><div class="layout-align-space-between-stretch layout-row" layout-align="space-between"><h2 class="header-link light-text"><span>Interlibrary Loan</span></h2></div></div><md-button class="button-with-icon overflow-visible md-button md-primoExplore-theme md-ink-ripple layout-align-center-center layout-row" type="button" layout="row" layout-align="center center" aria-label="view interlibrary loans checked out" style="" href="https://northwestern.illiad.oclc.org/illiad/illiad.dll?Action=10&Form=66"><span>View Items Checked Out</span></md-button><md-button class="button-with-icon overflow-visible md-button md-primoExplore-theme md-ink-ripple layout-align-center-center layout-row" type="button" layout="row" layout-align="center center" aria-label="view interlibrary loans checked out" style="" href="https://northwestern.illiad.oclc.org/illiad/illiad.dll?Action=10&Form=64"><span>View Items Available</span></md-button><md-button class="button-with-icon  overflow-visible md-button md-primoExplore-theme md-ink-ripple layout-align-center-center layout-row" type="button" layout="row" layout-align="center center" aria-label="view interlibrary loans checked out" style="" href="https://northwestern.illiad.oclc.org/illiad/illiad.dll?Action=10&Form=62"><span>View Requests in Process</span></md-button></div></div>'
});

//End add ILL links

// Check for content in Browzine

app.controller('prmSearchResultAvailabilityLineAfterController', function ($scope, $http, nodeserver) {
  var vm = this;
  $scope.book_icon = "https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png";
  if (vm.parentCtrl.result.pnx.addata.doi && vm.parentCtrl.result.pnx.display.type[0] == 'article') {
    vm.doi = vm.parentCtrl.result.pnx.addata.doi[0] || '';
    var articleURL = nodeserver + "/articles?DOI=" + vm.doi;
    $http.jsonp(articleURL, { jsonpCallbackParam: 'callback' }).then(function (response) {
      $scope.article = response.data;
    }, function (error) {
      console.log(error);
    });
  }
  if (vm.parentCtrl.result.pnx.addata.issn && vm.parentCtrl.result.pnx.display.type[0] == 'journal') {
    vm.issn = vm.parentCtrl.result.pnx.addata.issn[0].replace("-", "") || '';
    var journalURL = nodeserver + "/journals?ISSN=" + vm.issn;
    $http.jsonp(journalURL, { jsonpCallbackParam: 'callback' }).then(function (response) {
      $scope.journal = response.data;
    }, function (error) {
      console.log(error);
    });
  }
});

//Add Browzine and Hathitrust links to Brief Results

app.component('prmSearchResultAvailabilityLineAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'prmSearchResultAvailabilityLineAfterController',
  template: '<div ng-if="article.data.browzineWebLink"><a href="{{ article.data.browzineWebLink }}" target="_blank" title="Via BrowZine"><img src="https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png" class="browzine-icon"> View Issue Contents <md-icon md-svg-icon="primo-ui:open-in-new" aria-label="icon-open-in-new" role="img" class="browzine-external-link"><svg id="open-in-new_cache29" width="100%" height="100%" viewBox="0 0 24 24" y="504" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"></svg></md-icon></a></div><div ng-if="journal.data[0].browzineWebLink"><a href="{{ journal.data[0].browzineWebLink }}" target="_blank" title="Via BrowZine"><img src="https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png" class="browzine-icon"> View Journal Contents <md-icon md-svg-icon="primo-ui:open-in-new" aria-label="icon-open-in-new" role="img" class="browzine-external-link"><svg id="open-in-new_cache29" width="100%" height="100%" viewBox="0 0 24 24" y="504" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"></svg></md-icon></a></div><hathi-trust-availability hide-online="true"></hathi-trust-availability>'
});

// Add Journal Cover Images from BrowZine

app.controller('prmSearchResultThumbnailContainerAfterController', function ($scope, $http, nodeserver) {
  var vm = this;
  var newThumbnail = '';
  // checking for item property as this seems to impact virtual shelf browse (for reasons as yet unknown)
  if (vm.parentCtrl.item && vm.parentCtrl.item.pnx.addata.issn) {
    vm.issn = vm.parentCtrl.item.pnx.addata.issn[0].replace("-", "") || '';
    var journalURL = nodeserver + "/journals?ISSN=" + vm.issn;
    $http.jsonp(journalURL, { jsonpCallbackParam: 'callback' }).then(function (response) {
      if (response.data.data["0"] && response.data.data["0"].browzineEnabled) {
        newThumbnail = response.data.data["0"].coverImageUrl;
      }
    }, function (error) {
      console.log(error); //
    });
  }
  vm.$doCheck = function (changes) {
    if (vm.parentCtrl.selectedThumbnailLink) {
      if (newThumbnail != '') {
        vm.parentCtrl.selectedThumbnailLink.linkURL = newThumbnail;
      }
    }
  };
});

app.component('prmSearchResultThumbnailContainerAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'prmSearchResultThumbnailContainerAfterController'
});

// End BrowZine - Primo Integration

//Logo with link

/*
app.controller('prmLogoAfterController', [function () {
  var ctrl = this;

  ctrl.getIconLink = function () {
    return ctrl.parentCtrl.iconLink;
  };
}]);

app.component('prmLogoAfter', {
  bindings: {
    parentCtrl: '<'
  },
  controller: 'prmLogoAfterController',
  template: ' \n    <div class="product-logo product-logo-local" layout="row" layout-align="start center" layout-fill id="banner" tabindex="0" role="banner"><a href="http://www.library.northwestern.edu/"><img ng-src="{{$ctrl.getIconLink()}}" alt="{{(\'nui.header.LogoAlt\' | translate)}}"/></a>\n    </div>\n  '
});
*/

//End add logo with link


//Add NUPrint link to account

app.component('prmMessagesAndBlocksOverviewAfter', {
  bindings: { parentCtrl: '<' },
  template: '<div class="tiles-grid-tile"><div class="tile-content layout-column" layout="column"><div class="tile-header layout-column" layout="column"><div class="layout-align-space-between-stretch layout-row" layout="row" layout-align="space-between"><h2 class="header-link light-text"><span>NUPrint</span></h2></div></div><md-button class="button-with-icon overflow-visible md-button md-primoExplore-theme md-ink-ripple layout-align-center-center layout-row" type="button" layout="row" layout-align="center center" aria-label="view nuprint account" style="" href="https://nuprint.northwestern.edu/"><span>View Account</span></md-button></div></div>'
});

//End Add NUPrint
//Other search options

app.controller('prmFacetRangeAfterController', [function () {
  try {
    this.query = this.parentCtrl.facetService.$location.$$search.query.split(",")[2];
  } catch (e) {
    this.query = "";
  }
}]);

app.component('prmFacetRangeAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'prmFacetRangeAfterController',
  template: '<md-card class="default-card zero-margin _md md-primoExplore-theme"><md-card-content><p><strong>Not finding the book you were looking for?</strong> Try searching items held at other libraries:</p><md-button class="md-raised md-button md-primoExplore-theme md-ink-ripple" href="http://www.worldcat.org/search?q={{$ctrl.query}}" type="button" aria-label="Search WorldCat" style="margin-left:0;margin-right:0;"> <img src="custom/NULV3/img/worldcat-logo.png" width="22" height="22" alt="worldcat-logo" style="vertical-align:middle;"> Search WorldCat</md-button><p><span>Looking for an article? Try <strong><a href="http://scholar.google.com/scholar?hl=en&q={{$ctrl.query}}">Google Scholar</a></strong></span>.</p>Looking for related concepts? Try <strong><a href="http://turing.library.northwestern.edu/login?url=https://yewno.com/edu/?query={{$ctrl.query}}"">Yewno</a></strong>.<p></p><p>Other questions? <strong><a href="http://www.library.northwestern.edu/research/ask-us/index.html">Contact a Research Librarian for Assistance</a></strong>.</p></md-card-content></md-card>'
});

//Always display scope dropdown for basic searches

app.component('prmSearchBarAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'SearchBarAfterController'
});

app.controller('SearchBarAfterController', ['angularLoad', function (angularLoad) {
  var vm = this;
  vm.parentCtrl.showTabsAndScopes = true;
}]);

//End display scopes

//Add SMS actions menu

'use strict';

angular.module("sendSms", ["ngMaterial", "primo-explore.components"]), angular.module("sendSms").component("addSmsAction", {
  require: { prmActionCtrl: "^prmActionList" },
  controller: ["customActions", "smsOptions", function (e, n) {
    var t = this;
    this.$onInit = function () {
      e.actionExists(n.smsAction, t.prmActionCtrl) || e.addAction(n.smsAction, t.prmActionCtrl);
    }, this.$onDestroy = function () {
      e.actionExists(n.smsAction, t.prmActionCtrl) && e.removeAction(n.smsAction, t.prmActionCtrl);
    };
  }]
}), angular.module("sendSms").factory("customActions", function () {
  return {
    addAction: function addAction(e, n) {
      this.actionExists(e, n) ? console.error("Action already exists: ", e) : (this.addActionIcon(e, n), n.actionListService.requiredActionsList.splice(e.index, 0, e.name), n.actionListService.actionsToIndex[e.name] = e.index, n.actionListService.onToggle[e.name] = e.onToggle, n.actionListService.actionsToDisplay.unshift(e.name));
    },
    removeAction: function removeAction(e, n) {
      if (this.actionExists(e, n)) {
        this.removeActionIcon(e, n), delete n.actionListService.actionsToIndex[e.name], delete n.actionListService.onToggle[e.name];
        var t = n.actionListService.actionsToDisplay.indexOf(e.name);
        n.actionListService.actionsToDisplay.splice(t, 1), t = n.actionListService.requiredActionsList.indexOf(e.name), n.actionListService.requiredActionsList.splice(t, 1);
      } else console.error("Action does not exist: ", e);
    },
    addActionIcon: function addActionIcon(e, n) {
      n.actionLabelNamesMap[e.name] = e.label, n.actionIconNamesMap[e.name] = e.name, n.actionIcons[e.name] = e.icon;
    },
    removeActionIcon: function removeActionIcon(e, n) {
      delete n.actionLabelNamesMap[e.name], delete n.actionIconNamesMap[e.name], delete n.actionIcons[e.name];
    },
    actionExists: function actionExists(e, n) {
      return n.actionListService.actionsToIndex.hasOwnProperty(e.name);
    }
  };
}), angular.module("sendSms").component("ocaSendSms", {
  bindings: { item: "<", finishedSmsEvent: "&" },
  template: '<div class="send-actions-content-item" layout="row"><md-content layout-wrap layout-padding layout-fill><form name="smsForm" novalidate layout="column" layout-align="center center" (submit)="$ctrl.sendSms($event);"><div layout="row" class="layout-full-width" layout-align="center center"><div flex="20" flex-sm="10" hide-xs></div><div class="form-focus service-form" layout-padding flex><div layout-margin><div layout="column"><h4 class="md-subhead">Standard message and data rates may apply.</h4><md-input-container class="underlined-input md-required"><label>Phone number:</label><input ng-model="$ctrl.phoneNumber" name="phoneNumber" type="text" required ng-pattern="::$ctrl.telRegEx"><div ng-messages="smsForm.phoneNumber.$error"><div ng-message="pattern, required ">phone number is invalid</div></div></md-input-container><md-input-container class="md-required"><label>Carrier:</label><md-select ng-model="$ctrl.carrier" name="carrier" placeholder="Select a carrier" required><md-option ng-repeat="(carrier, address) in carriers" value="{{ address }}">{{ carrier }}</md-option></md-select><div ng-messages="smsForm.carrier.$error"><div ng-message="required">please select a carrier</div></div></md-input-container><md-input-container class="underlined-input" ng-if="$ctrl.isCaptcha"><div vc-recaptcha key="$ctrl.getCaptchaPublicKey()"on-success="$ctrl.setResponse(response)"></div><span class="recaptcha-error-info" ng-show="smsForm.$submitted && (smsForm.recaptchaResponse.$invalid || smsForm.$error.recaptcha.length)"><span translate="captcha.notselected"></span></span></md-input-container></div></div></div><div flex="20" flex-sm="10" hide-xs></div>\n</div>\n<div layout="row"><div layout="row" layout-align="center" layout-fill><md-button type="submit" class="button-with-icon button-large button-confirm" aria-label="Send the result by SMS"><prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="send"></prm-icon><span translate="email.popup.link.send"></span></md-button></div></div></form></md-content></div><prm-send-email ng-hide="true"></prm-send-email><oca-send-sms-after parent-ctrl="$ctrl"></oca-send-sms-after>',
  controller: ["$scope", "smsOptions", function (e, n) {
    var t = this;
    this.$onInit = function () {
      e.$watch("$$childTail.$ctrl", function (e) {
        return t.sendEmailService = e.sendEmailService;
      }), e.carriers = n.smsCarriers, t.carrier = t.phoneNumber = "", t.telRegEx = /^\d{3}( |-)?\d{3}( |-)?\d{4}$/;
    }, this.validate = function () {
      return t.telRegEx.test(t.phoneNumber) && t.carrier;
    }, this.isCaptcha = function () {
      return "Y" == window.appConfig["system-configuration"]["Activate Captcha [Y/N]"];
    }, this.getCaptchaPublicKey = function () {
      return window.appConfig["system-configuration"]["Public Captcha Key"];
    }, this.setResponse = function (e) {
      return t.gCaptchaResponse = e;
    }, this.sendSms = function () {
      t.validate() && t.sendEmailService.sendEmail([t.phoneNumber + "@" + t.carrier], "", "", [t.item], t.gCaptchaResponse).then(function (e) {
        return console.log("sms successfully sent", e);
      }).catch(function (e) {
        return console.error("sms sending failed", e);
      }).finally(function () {
        return t.finishedSmsEvent();
      });
    };
  }]
}).run(["$templateCache", "smsOptions", function (e, n) {
  e.put("components/search/actions/actionContainer/action-container.html", "\n  <oca-send-sms ng-if=\"($ctrl.actionName==='" + n.smsAction.name + '\')" finished-sms-event="$ctrl.throwCloseTabsEvent()" item="::$ctrl.item"></oca-send-sms>\n  <prm-send-email ng-if="($ctrl.actionName===\'E-mail\')" (finished-email-event)="$ctrl.throwCloseTabsEvent()" [item]="::$ctrl.item" [toggleform]="::$ctrl.toggleActionCotent" [user]="::\'\'"></prm-send-email>\n  <prm-citation ng-if="($ctrl.actionName===\'Citation\')" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-citation>\n  <prm-permalink ng-if="($ctrl.actionName===\'Permalink\')" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-permalink>\n  <prm-print-item ng-if="($ctrl.actionName===\'Print\')" (close-tabs-event)="$ctrl.throwCloseTabsEvent()" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-print-item>\n  <prm-endnote ng-if="($ctrl.actionName===\'EndNote\')" (close-tabs-event)="$ctrl.throwCloseTabsEvent()" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-endnote>\n  <prm-easybib ng-if="($ctrl.actionName===\'EasyBib\')" (close-tabs-event)="$ctrl.throwCloseTabsEvent()" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-easybib>\n  <prm-refworks ng-if="($ctrl.actionName===\'RefWorks\')" (close-tabs-event)="$ctrl.throwCloseTabsEvent()" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-refworks>\n  <prm-export-ris ng-if="($ctrl.actionName===\'RISPushTo\')" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-export-ris>\n  <prm-action-container-after parent-ctrl="$ctrl"></prm-action-container-after>');
}]), angular.module("sendSms").value("smsOptions", { smsAction: { name: "send_sms", label: "SMS", index: 9, icon: { icon: "ic_smartphone_24px", iconSet: "hardware", type: "svg" } }, smsCarriers: { ATT: "txt.att.net", "T-Mobile": "tmomail.net", Virgin: "vmobl.com", Sprint: "messaging.sprintpcs.com", Nextel: "messaging.nextel.com", Verizon: "vtext.com", Cricket: "mms.mycricket.com", Qwest: "qwestmp.com", "Project Fi": "msg.fi.google.com" } });

app.component('prmActionListAfter', {
  template: '<add-sms-action />'
});

//end SMS 

//Adds link to Yewno after each set of ten results

app.controller('prmSearchResultListAfterController', [function () {
  try {
    this.query = this.parentCtrl.facetService.$location.$$search.query.split(",")[2];
  } catch (e) {
    this.query = "";
  }
}]);

app.component('prmSearchResultListAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'prmSearchResultListAfterController',
  template: '<div class="layout-sm-column layout="column"><div class="layout-row" layout="row"><div class="layout-row flex" layout="row"><md-card class="one-slot _md md-primoExplore-theme flex yewno-recommender"><md-card-content class="layout-row" layout="row"><div class="max-width-100"><div class="layout-row"><div class="resource-image"><div class="resource-image-inner normlized-resource-image"><img class="md-card-image" src="custom/NULV3/img/yewno-logo.png"></div></div><div class="resource-content layout-fill"><h3 class="normal-text resource-title"><a href="http://turing.library.northwestern.edu/login?url=https://yewno.com/edu/?query={{$ctrl.query}}">Try Yewno Discover</a></h3><p>Yewno is a new research platform that displays search results as relationships between concepts.</p><p>Search Yewno when you want to explore a topic and see what the connections are.</p><div></div></div></div></md-card-content></md-card></div></div></div>'
});

//End add link to Yewno
//HathiTrust availability link

angular.module('hathiTrustAvailability', []).value('hathiTrustIconPath', 'custom/NULV3/img/hathitrust.svg').constant('hathiTrustBaseUrl', "https://catalog.hathitrust.org/api/volumes/brief/json/").config(['$sceDelegateProvider', 'hathiTrustBaseUrl', function ($sceDelegateProvider, hathiTrustBaseUrl) {
  var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
  urlWhitelist.push(hathiTrustBaseUrl + '**');
  $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
}]).factory('hathiTrust', ['$http', '$q', function ($http, $q) {
  var svc = {};
  var hathiTrustBaseUrl = "https://catalog.hathitrust.org/api/volumes/brief/json/";

  svc.findFullViewRecord = function (ids) {
    var deferred = $q.defer();

    var handleResponse = function handleResponse(resp) {
      var data = resp.data;
      var fullTextUrl = null;
      for (var i = 0; !fullTextUrl && i < ids.length; i++) {
        var result = data[ids[i]];
        for (var j = 0; j < result.items.length; j++) {
          var item = result.items[j];
          if (item.usRightsString.toLowerCase() === "full view") {
            fullTextUrl = result.records[item.fromRecord].recordURL;
            break;
          }
        }
      }
      deferred.resolve(fullTextUrl);
    };

    if (ids.length) {
      var hathiTrustLookupUrl = hathiTrustBaseUrl + ids.join('|');
      $http.jsonp(hathiTrustLookupUrl, { cache: true, jsonpCallbackParam: 'callback' }).then(handleResponse).catch(function (e) {
        console.log(e);
      });
    } else {
      deferred.resolve(null);
    }

    return deferred.promise;
  };

  return svc;
}]).controller('hathiTrustAvailabilityController', ['hathiTrust', 'hathiTrustIconPath', function (hathiTrust, hathiTrustIconPath) {
  var self = this;
  self.hathiTrustIconPath = hathiTrustIconPath;

  self.$onInit = function () {
    setDefaults();
    if (!(isOnline() && self.hideOnline)) {
      updateHathiTrustAvailability();
    }
  };

  var setDefaults = function setDefaults() {
    if (!self.msg) self.msg = 'Full Text Available at HathiTrust';
  };

  var isOnline = function isOnline() {
    return self.prmSearchResultAvailabilityLine.result.delivery.GetIt1.some(function (g) {
      return g.links.some(function (l) {
        return l.isLinktoOnline;
      });
    });
  };

  var updateHathiTrustAvailability = function updateHathiTrustAvailability() {
    var hathiTrustIds = (self.prmSearchResultAvailabilityLine.result.pnx.addata.oclcid || []).map(function (id) {
      return "oclc:" + id;
    });
    hathiTrust.findFullViewRecord(hathiTrustIds).then(function (res) {
      self.fullTextLink = res;
    });
  };
}]).component('hathiTrustAvailability', {
  require: {
    prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
  },
  bindings: {
    hideOnline: '<',
    msg: '@?'
  },
  controller: 'hathiTrustAvailabilityController',
  template: '<span ng-if="$ctrl.fullTextLink" class="umnHathiTrustLink">\
                <md-icon md-svg-src="{{$ctrl.hathiTrustIconPath}}" alt="HathiTrust Logo"></md-icon>\
                <a target="_blank" ng-href="{{$ctrl.fullTextLink}}">\
                {{ ::$ctrl.msg }}\
                  <prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\
                </a>\
              </span>'
});

!function(a){"use strict";function b(b,c,d){"addEventListener"in a?b.addEventListener(c,d,!1):"attachEvent"in a&&b.attachEvent("on"+c,d)}function c(b,c,d){"removeEventListener"in a?b.removeEventListener(c,d,!1):"detachEvent"in a&&b.detachEvent("on"+c,d)}function d(){var b,c=["moz","webkit","o","ms"];for(b=0;b<c.length&&!N;b+=1)N=a[c[b]+"RequestAnimationFrame"];N||h("setup","RequestAnimationFrame not supported")}function e(b){var c="Host page: "+b;return a.top!==a.self&&(c=a.parentIFrame&&a.parentIFrame.getId?a.parentIFrame.getId()+": "+b:"Nested host page: "+b),c}function f(a){return K+"["+e(a)+"]"}function g(a){return P[a]?P[a].log:G}function h(a,b){k("log",a,b,g(a))}function i(a,b){k("info",a,b,g(a))}function j(a,b){k("warn",a,b,!0)}function k(b,c,d,e){!0===e&&"object"==typeof a.console&&console[b](f(c),d)}function l(d){function e(){function a(){s(V),p(W)}g("Height"),g("Width"),t(a,V,"init")}function f(){var a=U.substr(L).split(":");return{iframe:P[a[0]].iframe,id:a[0],height:a[1],width:a[2],type:a[3]}}function g(a){var b=Number(P[W]["max"+a]),c=Number(P[W]["min"+a]),d=a.toLowerCase(),e=Number(V[d]);h(W,"Checking "+d+" is in range "+c+"-"+b),c>e&&(e=c,h(W,"Set "+d+" to min value")),e>b&&(e=b,h(W,"Set "+d+" to max value")),V[d]=""+e}function k(){function a(){function a(){var a=0,d=!1;for(h(W,"Checking connection is from allowed list of origins: "+c);a<c.length;a++)if(c[a]===b){d=!0;break}return d}function d(){var a=P[W].remoteHost;return h(W,"Checking connection is from: "+a),b===a}return c.constructor===Array?a():d()}var b=d.origin,c=P[W].checkOrigin;if(c&&""+b!="null"&&!a())throw new Error("Unexpected message received from: "+b+" for "+V.iframe.id+". Message was: "+d.data+". This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.");return!0}function l(){return K===(""+U).substr(0,L)&&U.substr(L).split(":")[0]in P}function w(){var a=V.type in{"true":1,"false":1,undefined:1};return a&&h(W,"Ignoring init message from meta parent page"),a}function y(a){return U.substr(U.indexOf(":")+J+a)}function z(a){h(W,"MessageCallback passed: {iframe: "+V.iframe.id+", message: "+a+"}"),N("messageCallback",{iframe:V.iframe,message:JSON.parse(a)}),h(W,"--")}function A(){var b=document.body.getBoundingClientRect(),c=V.iframe.getBoundingClientRect();return JSON.stringify({clientHeight:Math.max(document.documentElement.clientHeight,a.innerHeight||0),clientWidth:Math.max(document.documentElement.clientWidth,a.innerWidth||0),offsetTop:parseInt(c.top-b.top,10),offsetLeft:parseInt(c.left-b.left,10),scrollTop:a.pageYOffset,scrollLeft:a.pageXOffset})}function B(a,b){function c(){u("Send Page Info","pageInfo:"+A(),a,b)}x(c,32)}function C(){function d(b,c){function d(){P[g]?B(P[g].iframe,g):e()}["scroll","resize"].forEach(function(e){h(g,b+e+" listener for sendPageInfo"),c(a,e,d)})}function e(){d("Remove ",c)}function f(){d("Add ",b)}var g=W;f(),P[g].stopPageInfo=e}function D(){P[W]&&P[W].stopPageInfo&&(P[W].stopPageInfo(),delete P[W].stopPageInfo)}function E(){var a=!0;return null===V.iframe&&(j(W,"IFrame ("+V.id+") not found"),a=!1),a}function F(a){var b=a.getBoundingClientRect();return o(W),{x:Math.floor(Number(b.left)+Number(M.x)),y:Math.floor(Number(b.top)+Number(M.y))}}function G(b){function c(){M=g,H(),h(W,"--")}function d(){return{x:Number(V.width)+f.x,y:Number(V.height)+f.y}}function e(){a.parentIFrame?a.parentIFrame["scrollTo"+(b?"Offset":"")](g.x,g.y):j(W,"Unable to scroll to requested position, window.parentIFrame not found")}var f=b?F(V.iframe):{x:0,y:0},g=d();h(W,"Reposition requested from iFrame (offset x:"+f.x+" y:"+f.y+")"),a.top!==a.self?e():c()}function H(){!1!==N("scrollCallback",M)?p(W):q()}function I(b){function c(){var a=F(g);h(W,"Moving to in page link (#"+e+") at x: "+a.x+" y: "+a.y),M={x:a.x,y:a.y},H(),h(W,"--")}function d(){a.parentIFrame?a.parentIFrame.moveToAnchor(e):h(W,"In page link #"+e+" not found and window.parentIFrame not found")}var e=b.split("#")[1]||"",f=decodeURIComponent(e),g=document.getElementById(f)||document.getElementsByName(f)[0];g?c():a.top!==a.self?d():h(W,"In page link #"+e+" not found")}function N(a,b){return m(W,a,b)}function O(){switch(P[W].firstRun&&T(),V.type){case"close":n(V.iframe);break;case"message":z(y(6));break;case"scrollTo":G(!1);break;case"scrollToOffset":G(!0);break;case"pageInfo":B(P[W].iframe,W),C();break;case"pageInfoStop":D();break;case"inPageLink":I(y(9));break;case"reset":r(V);break;case"init":e(),N("initCallback",V.iframe),N("resizedCallback",V);break;default:e(),N("resizedCallback",V)}}function Q(a){var b=!0;return P[a]||(b=!1,j(V.type+" No settings for "+a+". Message was: "+U)),b}function S(){for(var a in P)u("iFrame requested init",v(a),document.getElementById(a),a)}function T(){P[W].firstRun=!1}var U=d.data,V={},W=null;"[iFrameResizerChild]Ready"===U?S():l()?(V=f(),W=R=V.id,!w()&&Q(W)&&(h(W,"Received: "+U),E()&&k()&&O())):i(W,"Ignored: "+U)}function m(a,b,c){var d=null,e=null;if(P[a]){if(d=P[a][b],"function"!=typeof d)throw new TypeError(b+" on iFrame["+a+"] is not a function");e=d(c)}return e}function n(a){var b=a.id;h(b,"Removing iFrame: "+b),a.parentNode.removeChild(a),m(b,"closedCallback",b),h(b,"--"),delete P[b]}function o(b){null===M&&(M={x:void 0!==a.pageXOffset?a.pageXOffset:document.documentElement.scrollLeft,y:void 0!==a.pageYOffset?a.pageYOffset:document.documentElement.scrollTop},h(b,"Get page position: "+M.x+","+M.y))}function p(b){null!==M&&(a.scrollTo(M.x,M.y),h(b,"Set page position: "+M.x+","+M.y),q())}function q(){M=null}function r(a){function b(){s(a),u("reset","reset",a.iframe,a.id)}h(a.id,"Size reset requested by "+("init"===a.type?"host page":"iFrame")),o(a.id),t(b,a,"reset")}function s(a){function b(b){a.iframe.style[b]=a[b]+"px",h(a.id,"IFrame ("+e+") "+b+" set to "+a[b]+"px")}function c(b){H||"0"!==a[b]||(H=!0,h(e,"Hidden iFrame detected, creating visibility listener"),y())}function d(a){b(a),c(a)}var e=a.iframe.id;P[e]&&(P[e].sizeHeight&&d("height"),P[e].sizeWidth&&d("width"))}function t(a,b,c){c!==b.type&&N?(h(b.id,"Requesting animation frame"),N(a)):a()}function u(a,b,c,d){function e(){var e=P[d].targetOrigin;h(d,"["+a+"] Sending msg to iframe["+d+"] ("+b+") targetOrigin: "+e),c.contentWindow.postMessage(K+b,e)}function f(){i(d,"["+a+"] IFrame("+d+") not found"),P[d]&&delete P[d]}function g(){c&&"contentWindow"in c&&null!==c.contentWindow?e():f()}d=d||c.id,P[d]&&g()}function v(a){return a+":"+P[a].bodyMarginV1+":"+P[a].sizeWidth+":"+P[a].log+":"+P[a].interval+":"+P[a].enablePublicMethods+":"+P[a].autoResize+":"+P[a].bodyMargin+":"+P[a].heightCalculationMethod+":"+P[a].bodyBackground+":"+P[a].bodyPadding+":"+P[a].tolerance+":"+P[a].inPageLinks+":"+P[a].resizeFrom+":"+P[a].widthCalculationMethod}function w(a,c){function d(){function b(b){1/0!==P[w][b]&&0!==P[w][b]&&(a.style[b]=P[w][b]+"px",h(w,"Set "+b+" = "+P[w][b]+"px"))}function c(a){if(P[w]["min"+a]>P[w]["max"+a])throw new Error("Value for min"+a+" can not be greater than max"+a)}c("Height"),c("Width"),b("maxHeight"),b("minHeight"),b("maxWidth"),b("minWidth")}function e(){var a=c&&c.id||S.id+F++;return null!==document.getElementById(a)&&(a+=F++),a}function f(b){return R=b,""===b&&(a.id=b=e(),G=(c||{}).log,R=b,h(b,"Added missing iframe ID: "+b+" ("+a.src+")")),b}function g(){h(w,"IFrame scrolling "+(P[w].scrolling?"enabled":"disabled")+" for "+w),a.style.overflow=!1===P[w].scrolling?"hidden":"auto",a.scrolling=!1===P[w].scrolling?"no":"yes"}function i(){("number"==typeof P[w].bodyMargin||"0"===P[w].bodyMargin)&&(P[w].bodyMarginV1=P[w].bodyMargin,P[w].bodyMargin=""+P[w].bodyMargin+"px")}function k(){var b=P[w].firstRun,c=P[w].heightCalculationMethod in O;!b&&c&&r({iframe:a,height:0,width:0,type:"init"})}function l(){Function.prototype.bind&&(P[w].iframe.iFrameResizer={close:n.bind(null,P[w].iframe),resize:u.bind(null,"Window resize","resize",P[w].iframe),moveToAnchor:function(a){u("Move to anchor","inPageLink:"+a,P[w].iframe,w)},sendMessage:function(a){a=JSON.stringify(a),u("Send Message","message:"+a,P[w].iframe,w)}})}function m(c){function d(){u("iFrame.onload",c,a),k()}b(a,"load",d),u("init",c,a)}function o(a){if("object"!=typeof a)throw new TypeError("Options is not an object")}function p(a){for(var b in S)S.hasOwnProperty(b)&&(P[w][b]=a.hasOwnProperty(b)?a[b]:S[b])}function q(a){return""===a||"file://"===a?"*":a}function s(b){b=b||{},P[w]={firstRun:!0,iframe:a,remoteHost:a.src.split("/").slice(0,3).join("/")},o(b),p(b),P[w].targetOrigin=!0===P[w].checkOrigin?q(P[w].remoteHost):"*"}function t(){return w in P&&"iFrameResizer"in a}var w=f(a.id);t()?j(w,"Ignored iFrame, already setup."):(s(c),g(),d(),i(),m(v(w)),l())}function x(a,b){null===Q&&(Q=setTimeout(function(){Q=null,a()},b))}function y(){function b(){function a(a){function b(b){return"0px"===P[a].iframe.style[b]}function c(a){return null!==a.offsetParent}c(P[a].iframe)&&(b("height")||b("width"))&&u("Visibility change","resize",P[a].iframe,a)}for(var b in P)a(b)}function c(a){h("window","Mutation observed: "+a[0].target+" "+a[0].type),x(b,16)}function d(){var a=document.querySelector("body"),b={attributes:!0,attributeOldValue:!1,characterData:!0,characterDataOldValue:!1,childList:!0,subtree:!0},d=new e(c);d.observe(a,b)}var e=a.MutationObserver||a.WebKitMutationObserver;e&&d()}function z(a){function b(){B("Window "+a,"resize")}h("window","Trigger event: "+a),x(b,16)}function A(){function a(){B("Tab Visable","resize")}"hidden"!==document.visibilityState&&(h("document","Trigger event: Visiblity change"),x(a,16))}function B(a,b){function c(a){return"parent"===P[a].resizeFrom&&P[a].autoResize&&!P[a].firstRun}for(var d in P)c(d)&&u(a,b,document.getElementById(d),d)}function C(){b(a,"message",l),b(a,"resize",function(){z("resize")}),b(document,"visibilitychange",A),b(document,"-webkit-visibilitychange",A),b(a,"focusin",function(){z("focus")}),b(a,"focus",function(){z("focus")})}function D(){function a(a,c){function d(){if(!c.tagName)throw new TypeError("Object is not a valid DOM element");if("IFRAME"!==c.tagName.toUpperCase())throw new TypeError("Expected <IFRAME> tag, found <"+c.tagName+">")}c&&(d(),w(c,a),b.push(c))}var b;return d(),C(),function(c,d){switch(b=[],typeof d){case"undefined":case"string":Array.prototype.forEach.call(document.querySelectorAll(d||"iframe"),a.bind(void 0,c));break;case"object":a(c,d);break;default:throw new TypeError("Unexpected data type ("+typeof d+")")}return b}}function E(a){a.fn.iFrameResize=function(a){return this.filter("iframe").each(function(b,c){w(c,a)}).end()}}var F=0,G=!1,H=!1,I="message",J=I.length,K="[iFrameSizer]",L=K.length,M=null,N=a.requestAnimationFrame,O={max:1,scroll:1,bodyScroll:1,documentElementScroll:1},P={},Q=null,R="Host Page",S={autoResize:!0,bodyBackground:null,bodyMargin:null,bodyMarginV1:8,bodyPadding:null,checkOrigin:!0,inPageLinks:!1,enablePublicMethods:!0,heightCalculationMethod:"bodyOffset",id:"iFrameResizer",interval:32,log:!1,maxHeight:1/0,maxWidth:1/0,minHeight:0,minWidth:0,resizeFrom:"parent",scrolling:!1,sizeHeight:!0,sizeWidth:!1,tolerance:0,widthCalculationMethod:"scroll",closedCallback:function(){},initCallback:function(){},messageCallback:function(){j("MessageCallback function not defined")},resizedCallback:function(){},scrollCallback:function(){return!0}};a.jQuery&&E(jQuery),"function"==typeof define&&define.amd?define([],D):"object"==typeof module&&"object"==typeof module.exports?module.exports=D():a.iFrameResize=a.iFrameResize||D()}(window||{});

console.log('BOOO');
console.log(iFrameResize());
console.log('BOOO');
