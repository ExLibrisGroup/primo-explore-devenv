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

app.controller('prmLoginAlmaMashupAfterController', function ($scope) {
  var mashScope;
  // Find the prm-alma-mashup scope.
  // This is a horrid hack, but I seen no alternatives.
  // There's no prm-alma-mashup-after to use.
  function traverse(node) {
    if (mashScope) return;
    if (node.$ctrl) {
      if (node.$ctrl.service) {
        if (node.$ctrl.service.linkElement && node.$ctrl.service.linkElement.category === 'Alma-E') {
          $scope.mashScope = node.$ctrl.service.linkElement.links[0].link;
          return;
        }
      }
    }
    if (node.$$childHead) traverse(node.$$childHead)
    if (node.$$nextSibling) traverse(node.$$nextSibling)
  }
  traverse($scope.$root);
});

app.component('prmLoginAlmaMashupAfter', {
  controller: 'prmLoginAlmaMashupAfterController',
  template: '<div>Hello: {{mashScope}}<iframe ng-src="https://libguides.galter.northwestern.edu" /></div>'
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
