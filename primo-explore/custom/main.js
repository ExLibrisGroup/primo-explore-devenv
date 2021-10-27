import 'primo-explore-lod-author-card';

(function(){
"use strict";
'use strict';

var app = angular.module('viewCustom', ['angularLoad', 'externalSearch', 'hathiTrustAvailability', 'myILL', 'lodAuthorCard']);

"use strict";
'use strict';

/************************************* BEGIN Customization Variables ************************************/

//Here you can enter options to be passed to customization packages to configure them.

//My ILL

app.constant('illiadOptions', {
  "groups": ["nfaculty", "nstaff", "nundergrad", "ngraduate", "nlibstaff", "lfaculty", "lstaff", "lgraduate", "lundergrad", "NILR", "scsug", "scsgrad", "qfaculty"],
  "remoteScript": "https://discoweb1-p.library.northwestern.edu/my-ill/illiad.php",
  "boxTitle": "NUL Interlibrary Loan",
  "illiadURL": "https://northwestern.illiad.oclc.org/illiad/Logon.html",
  "apiURL": "https://northwestern.illiad.oclc.org/ILLiadWebPlatform/Transaction/UserRequests/"

});

// End Customization Variables

// Add top alert

app.component('prmTopbarAfterAppStoreGenerated', {
  template: /*html*/'\n    <primo-explore-top-alert>      <md-toolbar>        <div class="bar alert-bar" layout="row" layout-align="left center">          <span class="bar-text"><prm-icon error-attention="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="error-attention"></prm-icon>           Coronavirus information for              <a href="https://www.feinberg.northwestern.edu/sites/covid-19/" target="_blank" class="primo-explore-top-alert-link"><strong>Feinberg. </strong></a>\n            </span>\n        </div>\n      </md-toolbar>\n    </primo-explore-top-alert>',
  controller: ['$element', function ($element) {
    var ctrl = this;
    ctrl.$postLink = function () {
      var $primoExploreMain = $element.parent().parent().parent();
      var $el = $element.query('primo-explore-top-alert').detach();
      $primoExploreMain.prepend($el);
    };
  }]
});

// Enhance No Results tile

app.controller('prmNoSearchResultAfterAppStoreGeneratedControllerAppStoreGenerated', [function () {
  var vm = this;
  vm.getSearchTerm = getSearchTerm;
  function getSearchTerm() {
    return vm.parentCtrl.term;
  }
}]);

app.component('prmNoSearchResultAfterAppStoreGenerated', {
  bindings: { parentCtrl: '<' },
  controller: 'prmNoSearchResultAfterAppStoreGeneratedControllerAppStoreGenerated',
  template: '<md-card class="default-card zero-margin _md md-primoExplore-theme"><md-card-title><md-card-title-text><span translate="" class="md-headline ng-scope">No records found.</span></md-card-title-text></md-card-title><md-card-content><p><span>There are no results matching your search: <i>{{$ctrl.getSearchTerm()}}</i>. Looking for a book? Try again searching items held at other libraries:</span></p><md-button class="md-raised md-button md-primoExplore-theme md-ink-ripple" href="http://www.worldcat.org/search?q={{$ctrl.getSearchTerm()}}" type="button" aria-label="Search WorldCat" style="margin-left:0;margin-right:0;"> <img src="custom/01NWU_INST-NULVNEW/img/worldcat-logo.png" width="22" height="22" alt="worldcat-logo" style="vertical-align:middle;"> Search WorldCat</md-button><p><span>Looking for an article? Try <strong><a href="http://scholar.google.com/scholar?hl=en&q={{$ctrl.getSearchTerm()}}">Google Scholar</a></strong></span>.</p><p><span translate="" class="bold-text ng-scope">Suggestions:</span></p><ul><li translate="" class="ng-scope">Make sure that all words are spelled correctly.</li><li translate="" class="ng-scope">Try a different search scope.</li><li translate="" class="ng-scope">Try different search terms.</li><li translate="" class="ng-scope">Try more general search terms.</li><li translate="" class="ng-scope">Try fewer search terms.</li></ul><p><strong><a href="https://galter.northwestern.edu/request-services-and-materials/ask-a-librarian">Contact a Research Librarian for Assistance</a></strong>.</p></md-card-content></md-card>'
});

//End Enhance No Results tile

//Logo with link

app.controller('prmLogoAfterAppStoreGeneratedControllerAppStoreGenerated', [function () {
  var ctrl = this;

  ctrl.getIconLink = function () {
    return ctrl.parentCtrl.iconLink;
  };
}]);

app.component('prmLogoAfterAppStoreGenerated', {
  bindings: {
    parentCtrl: '<'
  },
  controller: 'prmLogoAfterAppStoreGeneratedControllerAppStoreGenerated',
  template: ' \n    <div class="product-logo product-logo-local" layout="row" layout-align="start center" layout-fill id="banner" tabindex="0" role="banner"><a href="https://www.feinberg.northwestern.edu/"><img ng-src="{{$ctrl.getIconLink()}}" alt="{{(\'nui.header.LogoAlt\' | translate)}}"/></a>\n    </div>\n  '
});

//End add logo with link

//Add NUPrint link to account

app.component('prmMessagesAndBlocksOverviewAfterAppStoreGenerated', {
  bindings: { parentCtrl: '<' },
  template: '<div class="tiles-grid-tile"><div class="tile-content layout-column" layout="column"><div class="tile-header layout-column" layout="column"><div class="layout-align-space-between-stretch layout-row" layout="row" layout-align="space-between"><h2 class="header-link light-text"><span>NUPrint</span></h2></div></div><md-button class="button-with-icon overflow-visible md-button md-primoExplore-theme md-ink-ripple layout-align-center-center layout-row" type="button" layout="row" layout-align="center center" aria-label="view nuprint account" style="" href="https://nuprint.northwestern.edu/"><span>View Account</span></md-button></div></div>'
});

//End Add NUPrint

// Add link to form to update chosen name in My Account
app.component('prmAccountLinksAfterAppStoreGenerated', {
  bindings: { parentCtrl: '<' },
  template: '<a href="https://www.library.northwestern.edu/find-borrow-request/borrowing-materials/update-name.html" target="_blank" class="bold-text margin-left-small md-primoExplore-theme"><span>Update Your Name</span><prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon></a>'
});

// End add link to My Account







// External Search

angular.module('externalSearch', []).value('searchTargets', [{
  "name": "Galter Website",
  "url": "https://galter.northwestern.edu/search/results?utf8=%E2%9C%93&engine=local&searchterm=",
  "img": "custom/01NWU_INST-HSLV/img/galter-favicon.png",
  mapping: function mapping(queries, filters) {
    try {
      return queries.map(part => part.split(",")[2] || "").join(' ')
    }
    catch (e) {
      return ''
    }
  }
}, {
  "name": "PubMed",
  "url": "https://turing.library.northwestern.edu/login?url=https://pubmed.ncbi.nlm.nih.gov/?otool=norwelib&term=",
  "img": "custom/01NWU_INST-HSLV/img/logo-pubmed.png",
  mapping: function mapping(queries, filters) {
    try {
      return queries.map(part => part.split(",")[2] || "").join(' ')
    }
    catch (e) {
      return ''
    }
  }
}, {
  "name": "Google Scholar",
  "url": "https://turing.library.northwestern.edu/login?url=https://scholar.google.com/scholar?q=",
  "img": "custom/01NWU_INST-HSLV/img/logo-googlescholar.png",
  mapping: function mapping(queries, filters) {
    try {
      return queries.map(part => part.split(",")[2] || "").join(' ')
    }
    catch (e) {
      return ''
    }
  }
}, {
  "name": "WorldCat",
  "url": "https://turing.library.northwestern.edu/login?url=http://www.worldcat.org/search?",
  "img": "custom/01NWU_INST-HSLV/img/worldcat-logo.png",
  mapping: function (queries, filters) {
    const query_mappings = {
      'any': 'kw',
      'title': 'ti',
      'creator': 'au',
      'subject': 'su',
      'isbn': 'bn',
      'issn': 'n2',
      'lds13': 'ti'
    }
    try {
      return 'q=' + queries.map(part => {
        let terms = part.split(',')
        let type = query_mappings[terms[0]] || 'kw'
        let string = terms[2] || ''
        let join = terms[3] || ''
        return type + ':' + string + ' ' + join + ' '
      }).join('')
    }
    catch (e) {
      return ''
    }
  }
}]).component('prmFacetAfterAppStoreGenerated', {
  bindings: { parentCtrl: '<' },
  controller: ['externalSearch', function (externalSearch) {
    this.$onInit = function () {
      externalSearch.setController(this.parentCtrl);
      externalSearch.addExtSearch();
    };
  }]
}).component('prmPageNavMenuAfterAppStoreGenerated', {
  controller: ['externalSearch', function (externalSearch) {
    this.$onInit = function () {
      if (externalSearch.getController()) externalSearch.addExtSearch();
    };
  }]
}).component('prmFacetExactAfterAppStoreGenerated', {
  bindings: { parentCtrl: '<' },
  template: '<div ng-if="name === \'Search More\'">\
          <div ng-hide="$ctrl.parentCtrl.facetGroup.facetGroupCollapsed">\
              <div class="section-content animate-max-height-variable">\
                  <div class="md-chips md-chips-wrap">\
                      <div ng-repeat="target in targets" aria-live="polite" class="md-chip animate-opacity-and-scale facet-element-marker-local4">\
                          <div class="md-chip-content layout-row" role="button" tabindex="0">\
                              <strong dir="auto" title="{{ target.name }}">\
                                  <a ng-href="{{ target.url + target.mapping(queries, filters) }}" target="_blank">\
                                      <img ng-src="{{ target.img }}" width="22" height="22" alt="{{ target.alt }}" style="vertical-align:middle;"> {{ target.name }}\
                                  </a>\
                              </strong>\
                          </div>\
                      </div>\
                  </div>\
              </div>\
          </div>\
      </div>',
  controller: ['$scope', '$location', 'searchTargets', function ($scope, $location, searchTargets) {
    this.$onInit = function () {
      $scope.name = this.parentCtrl.facetGroup.name;
      $scope.targets = searchTargets;
      var query = $location.search().query;
      var filter = $location.search().pfilter;
      $scope.queries = Object.prototype.toString.call(query) === '[object Array]' ? query : query ? [query] : false;
      $scope.filters = Object.prototype.toString.call(filter) === '[object Array]' ? filter : filter ? [filter] : false;
    };
  }]
}).factory('externalSearch', function () {
  return {
    getController: function getController() {
      return this.prmFacetCtrl || false;
    },
    setController: function setController(controller) {
      this.prmFacetCtrl = controller;
    },
    addExtSearch: function addExtSearch() {
      var xx = this;
      var checkExist = setInterval(function () {

        if (xx.prmFacetCtrl.facetService.results[0] && xx.prmFacetCtrl.facetService.results[0].name != "Search More") {
          if (xx.prmFacetCtrl.facetService.results.name !== 'Search More') {
            xx.prmFacetCtrl.facetService.results.unshift({
              name: 'Search More',
              displayedType: 'exact',
              limitCount: 0,
              facetGroupCollapsed: false,
              values: undefined
            });
          }
          clearInterval(checkExist);
        }
      }, 100);
    }
  };
});

// End External Search

//Always display scope dropdown for basic searches

app.component('prmSearchBarAfterAppStoreGenerated', {
  bindings: { parentCtrl: '<' },
  controller: 'SearchBarAfterControllerAppStoreGenerated'
});

app.controller('SearchBarAfterControllerAppStoreGenerated', ['angularLoad', function (angularLoad) {
  var vm = this;
  vm.parentCtrl.showTabsAndScopes = true;
}]);

//End display scopes

//Hathi Trust

app.component('prmSearchResultAvailabilityLineAfterAppStoreGenerated', {
  template: '<hathi-trust-availability hide-online="true" entity-id="urn:mace:incommon:northwestern.edu"></hathi-trust-availability>'
});

angular.module('hathiTrustAvailability', []).constant('hathiTrustBaseUrl', 'https://catalog.hathitrust.org/api/volumes/brief/json/').config(['$sceDelegateProvider', 'hathiTrustBaseUrl', function ($sceDelegateProvider, hathiTrustBaseUrl) {
  var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
  urlWhitelist.push(hathiTrustBaseUrl + '**');
  $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
}]).factory('hathiTrust', ['$http', '$q', 'hathiTrustBaseUrl', function ($http, $q, hathiTrustBaseUrl) {
  var svc = {};

  var lookup = function lookup(ids) {
    if (ids.length) {
      var hathiTrustLookupUrl = hathiTrustBaseUrl + ids.join('|');
      return $http.jsonp(hathiTrustLookupUrl, {
        cache: true,
        jsonpCallbackParam: 'callback'
      }).then(function (resp) {
        return resp.data;
      });
    } else {
      return $q.resolve(null);
    }
  };

  // find a HT record URL for a given list of identifiers (regardless of copyright status)
  svc.findRecord = function (ids) {
    return lookup(ids).then(function (bibData) {
      for (var i = 0; i < ids.length; i++) {
        var recordId = Object.keys(bibData[ids[i]].records)[0];
        if (recordId) {
          return $q.resolve(bibData[ids[i]].records[recordId].recordURL);
        }
      }
      return $q.resolve(null);
    }).catch(function (e) {
      console.error(e);
    });
  };

  // find a public-domain HT record URL for a given list of identifiers
  svc.findFullViewRecord = function (ids) {
    var handleResponse = function handleResponse(bibData) {
      var fullTextUrl = null;
      for (var i = 0; !fullTextUrl && i < ids.length; i++) {
        var result = bibData[ids[i]];
        for (var j = 0; j < result.items.length; j++) {
          var item = result.items[j];
          if (item.usRightsString.toLowerCase() === 'full view') {
            fullTextUrl = result.records[item.fromRecord].recordURL;
            break;
          }
        }
      }
      return $q.resolve(fullTextUrl);
    };
    return lookup(ids).then(handleResponse).catch(function (e) {
      console.error(e);
    });
  };

  return svc;
}]).controller('hathiTrustAvailabilityControllerAppStoreGenerated', ['hathiTrust', function (hathiTrust) {
  var self = this;

  self.$onInit = function () {
    if (!self.msg) self.msg = 'Full Text Available at HathiTrust';

    // prevent appearance/request iff 'hide-online'
    if (self.hideOnline && isOnline()) {
      return;
    }

    // prevent appearance/request iff 'hide-if-journal'
    if (self.hideIfJournal && isJournal()) {
      return;
    }

    // prevent appearance/request if item is unavailable
    if (self.ignoreCopyright && !isAvailable()) {
      //allow links for locally unavailable items that are in the public domain
      self.ignoreCopyright = false;
    }

    // look for full text at HathiTrust
    updateHathiTrustAvailability();
  };

  var isJournal = function isJournal() {
    var format = self.prmSearchResultAvailabilityLine.result.pnx.addata.format[0];
    return !(format.toLowerCase().indexOf('journal') == -1); // format.includes("Journal")
  };

  var isAvailable = function isAvailable() {
    var available = self.prmSearchResultAvailabilityLine.result.delivery.availability[0];
    return available.toLowerCase().indexOf('unavailable') == -1;
  };

  var isOnline = function isOnline() {
    var delivery = self.prmSearchResultAvailabilityLine.result.delivery || [];
    if (!delivery.GetIt1) return delivery.deliveryCategory.indexOf('Alma-E') !== -1;
    return self.prmSearchResultAvailabilityLine.result.delivery.GetIt1.some(function (g) {
      return g.links.some(function (l) {
        return l.isLinktoOnline;
      });
    });
  };

  var formatLink = function formatLink(link) {
    return self.entityId ? link + '?signon=swle:' + self.entityId : link;
  };

  var isOclcNum = function isOclcNum(value) {
    return value.match(/^(\(ocolc\))?\d+$/i);
  };

  var updateHathiTrustAvailability = function updateHathiTrustAvailability() {
    var hathiTrustIds = (self.prmSearchResultAvailabilityLine.result.pnx.display.lds16 || []).filter(isOclcNum).map(function (id) {
      return 'oclc:' + id.toLowerCase().replace('(ocolc)', '');
    });
    hathiTrust[self.ignoreCopyright ? 'findRecord' : 'findFullViewRecord'](hathiTrustIds).then(function (res) {
      if (res) self.fullTextLink = formatLink(res);
    });
  };
}]).component('hathiTrustAvailability', {
  require: {
    prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
  },
  bindings: {
    entityId: '@',
    ignoreCopyright: '<',
    hideIfJournal: '<',
    hideOnline: '<',
    msg: '@?'
  },
  controller: 'hathiTrustAvailabilityControllerAppStoreGenerated',
  template: '<span ng-if="$ctrl.fullTextLink" class="umnHathiTrustLink">\
                <md-icon alt="HathiTrust Logo">\
                  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve">  <image id="image0" width="16" height="16" x="0" y="0"\
                  xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJN\
                  AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACNFBMVEXuegXvegTsewTveArw\
                  eQjuegftegfweQXsegXweQbtegnsegvxeQbvegbuegbvegbveQbtegfuegbvegXveQbvegbsfAzt\
                  plfnsmfpq1/wplPuegXvqFrrq1znr2Ptok/sewvueQfuegbtegbrgRfxyJPlsXDmlTznnk/rn03q\
                  pVnomkjnlkDnsGnvwobsfhPveQXteQrutHDqpF3qnUnpjS/prmDweQXsewjvrWHsjy7pnkvqqGDv\
                  t3PregvqhB3uuXjusmzpp13qlz3pfxTskC3uegjsjyvogBfpmkHpqF/us2rttXLrgRjrgBjttXDo\
                  gx/vtGznjzPtfhHqjCfuewfrjCnwfxLpjC7wtnDogBvssmjpfhLtegjtnEjrtnTmjC/utGrsew7s\
                  o0zpghnohB/roUrrfRHtsmnlkTbrvH3tnEXtegXvegTveQfqhyHvuXjrrGTpewrsrmXqfRHogRjt\
                  q2Dqewvqql/wu3vqhyDueQnwegXuegfweQPtegntnUvnt3fvxI7tfhTrfA/vzJvmtXLunEbtegrw\
                  egTregzskjbsxI/ouoPsqFzniyrz2K3vyZnokDLpewvtnkv30J/w17XsvYXjgBbohR7nplnso1L0\
                  1Kf40Z/um0LvegXngBnsy5juyJXvsGftrGTnhB/opVHoew7qhB7rzJnnmErkkz3splbqlT3smT3t\
                  tXPqqV7pjzHvunjrfQ7vewPsfA7uoU3uqlruoEzsfQ/vegf///9WgM4fAAAAFHRSTlOLi4uLi4uL\
                  i4uLi4uLi4tRUVFRUYI6/KEAAAABYktHRLvUtndMAAAAB3RJTUUH4AkNDgYNB5/9vwAAAQpJREFU\
                  GNNjYGBkYmZhZWNn5ODk4ubh5WMQERUTl5CUEpWWkZWTV1BUYlBWUVVT19BUUtbS1tHV0zdgMDQy\
                  NjE1MzRXsrC0sraxtWOwd3B0cnZxlXZz9/D08vbxZfDzDwgMCg4JdQsLj4iMio5hiI2LT0hMSk5J\
                  TUvPyMzKzmHIzcsvKCwqLiktK6+orKquYZCuratvaGxqbmlta+8QNRBl6JQ26Oru6e3rnzBx0uQ8\
                  aVGGvJopU6dNn1E8c9bsOXPniYoySM+PXbBw0eIlS5fl1C+PFRFlEBUVXbFy1eo1a9fliQDZYIHY\
                  9fEbNm7avEUUJiC6ddv2HTt3mSuBBfhBQEBQSEgYzOIHAHtfTe/vX0uvAAAAJXRFWHRkYXRlOmNy\
                  ZWF0ZQAyMDE2LTA5LTEzVDE0OjA2OjEzLTA1OjAwNMgVqAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAx\
                  Ni0wOS0xM1QxNDowNjoxMy0wNTowMEWVrRQAAAAASUVORK5CYII=" />\
                  </svg> \
                </md-icon>\
                <a target="_blank" ng-href="{{$ctrl.fullTextLink}}">\
                {{ ::$ctrl.msg }}\
                  <prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\
                </a>\
              </span>'
});

//End Hathi Trust module

//My-ill

angular.module('myILL', []).component('prmLoansOverviewAfterAppStoreGenerated', {
  bindings: { parentCtrl: '<' },
  controller: function controller($scope, $element, $q, $http, illService, illiadOptions) {
    var whitelistGroups = illiadOptions.groups;
    $scope.illBox = false;
    this.$onInit = function () {
      /* from: https://github.com/mehmetc/primo-explore-dom/blob/master/js/primo/explore/helper.js */
      var rootScope = $scope.$root;
      var uSMS = rootScope.$$childHead.$ctrl.userSessionManagerService;
      var jwtData = uSMS.jwtUtilService.getDecodedToken();
      console.log(jwtData);
      var userGroup = jwtData.userGroup;
      var user = jwtData.user;
      var check = whitelistGroups.indexOf(userGroup);
      if (check >= 0) {
        $scope.illBox = true;
        //$scope.showGlobe = true;
        $scope.boxTitle = illiadOptions.boxTitle;
        $scope.illiadURL = illiadOptions.illiadURL;
        console.log($scope.boxTitle);
        var url = illiadOptions.remoteScript;
        var response = illService.getILLiadData(url, user).then(function (response) {
          console.log(response);
          $scope.articles = response.data.Articles;
          $scope.requests = response.data.Requests;
          /*if ($scope.requests || $scope.articles) {
            $scope.showGlobe = false;
          }*/
        });
      }
    };
  },

  template: '<div class="tiles-grid-tile" ng-show={{illBox}}><div class="layout-column tile-content" layout="column"><div class="layout-column tile-header" layout="column"><div class="layout-align-space-between-stretch layout-row" layout="row layout-align=space-between"><h2 class="header-link light-text" role="button" tabindex="0"><span>{{boxTitle}}</span></h2></div></div><div><p style="font-size: 18px;font-weight: 400; padding: 0 16px;">Pending Requests:</p><illrequest ng-if="requests" ng-repeat="y in requests" item="y"></illrequest><div ng-if="!requests" style="text-align: center;"><p style="padding: 0 16px;">You have no requests.</p></div><div style="text-align:center;"></div><p style="font-size: 18px; font-weight: 400; padding: 0 16px;">My Articles:</p><illarticle ng-if="articles" ng-repeat="x in articles" item="x"></illarticle><div ng-if="!articles" style="text-align: center"><p style="padding: 0 16px;">You have no articles.</p></div><div style="text-align: center;"></div></div><md-button class="button-with-icon overflow-visible md-button md-primoExplore-theme md-ink-ripple layout-align-center-center layout-row" type="button" layout="row" layout-align="center center" aria-label="view interlibrary loans checked out" style="" href="{{illiadURL}}"><span>Sign in to your ILL account</span><prm-icon aria-label="arrow right" class="arrow-icon" icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-right"><md-icon md-svg-icon="primo-ui:chevron-right" aria-label="arrow right" class="md-primoExplore-theme" aria-hidden="true"></md-icon></prm-icon></md-button></div></div>'
}).component('illarticle', {
  bindings: { item: '<' },
  controller: function controller($scope) {
    console.log(this.item);
    //console.log(this.item.index);
    $scope.url = this.item.url;
    $scope.title = this.item.title;
    $scope.item = this.item;
    $scope.jtitle = this.item.jtitle;
    $scope.author = this.item.author;
    $scope.count = this.item.count;
    $scope.expires = this.item.expires;
  },
  template: '<md-list class="layout-column md-primoExplore-theme my-ill" layout="column" role="list" style="color:#4E2A84;"><md-list-item class="md-3-line" role="listitem" tabindex="-1"><div class="_md-list-item-inner"><div class="md-list-item-text"><h3><a href="{{url}}" target="_blank">{{title}}</a></h3><h4>{{author}}</h4><h4>Expires {{expires}}.</h4></div></div></md-list-item></md-list>'
}).component('illrequest', {
  bindings: { item: '<' },
  controller: function controller($scope) {
    $scope.title = this.item.title;
    $scope.author = this.item.author;
    $scope.count = this.item.count;
  },

  //template:"<p>{{count}}) {{title}}/ {{author}}. </p>"
  template: '<md-list class="layout-column md-primoExplore-theme my-ill" layout="column" role="list" style="color:#4E2A84;"><md-list-item class="md-2-line" role="listitem" tabindex="-1"><div class="_md-list-item-inner"><div class="md-list-item-text"><h3>{{title}}</h3><h4>{{author}}</h4></div></div></md-list-item></md-list>'
}).factory('illService', ['$http', function ($http) {
  return {
    getILLiadData: function getILLiadData(url, user) {
      return $http({
        method: 'GET',
        url: url,
        params: { 'user': user },
        cache: true
      });
    }
  };
}]);

//End My-ill

// Altmetric plugin

app.controller('FullViewAfterController', ['angularLoad', '$http', '$scope', '$element', '$timeout', '$window', function (angularLoad, $http, $scope, $element, $timeout, $window) {
  var altmetric_endpoint = 'https://api.altmetric.com/v1';
  var altmetric_widget = 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js?';
  var vm = this;
  this.$http = $http;
  this.$element = $element;
  this.$scope = $scope;
  this.$window = $window;
  vm.$onInit = function () //wait for all the bindings to be initialised
  {
    vm.parentElement = this.$element.parent()[0]; //the prm-full-view container
    try {
        vm.doi = vm.parentCtrl.item.pnx.addata.doi[0] || '';
    } catch (e) {
      return;
    }

    if (vm.doi) {
      //If we've got a doi to work with check whether altmetrics has data for it.
      //If so, make our div visible and create a new Altmetrics service
      $timeout(function () {
        $http.get(altmetric_endpoint + '/doi/' + vm.doi).then(function () {
          try {
            //Get the altmetrics widget
            angularLoad.loadScript(altmetric_widget + Date.now()).then(function () {});
            //Create our new Primo service
            var altmetricsSection = {
              scrollId: "altmetrics",
              serviceName: "altmetrics",
              title: "brief.results.tabs.Altmetrics"
            };
            vm.parentCtrl.services.splice(vm.parentCtrl.services.length, 0, altmetricsSection);
          } catch (e) {
            console.log(e);
          }
        }).catch(function (e) {
          return;
        });
      }, 3000);
    }


    //move the altmetrics widget into the new Altmetrics service section
    var unbindWatcher = this.$scope.$watch(function () {
      return vm.parentElement.querySelector('h4[translate="brief.results.tabs.Altmetrics"]');
    }, function (newVal, oldVal) {
      if (newVal) {
        //Get the section body associated with the value we're watching
        let altContainer = newVal.parentElement.parentElement.parentElement.parentElement.children[1];
        let almt1 = vm.parentElement.children[1].children[0];
        if (altContainer && altContainer.appendChild && altm1) {
            altContainer.appendChild(altm1);
        }
        unbindWatcher();
      }
    });
  }; // end of $onInit

  //You'd also need to look at removing the various css/js scripts loaded by this.
  //refer to: https://github.com/Det-Kongelige-Bibliotek/primo-explore-rex
  vm.$onDestroy = function ()
  {
    if (this.$window._altmetric) {
        delete this.$window._altmetric;
    }

    if (this.$window._altmetric_embed_init) {
        delete this.$window._altmetric_embed_init;
    }

    if (this.$window.AltmetricTemplates) {
        delete this.$window.AltmetricTemplates;
    }
  }
}]); // end FullViewAfterController

app.component('prmFullViewAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'FullViewAfterController',
  template: '<div id="altm1" ng-if="$ctrl.doi" class="altmetric-embed" data-hide-no-mentions="true" data-link-target="new" data-badge-type="medium-donut" data-badge-details="right" data-doi="{{$ctrl.doi}}"></div>\
             <primo-explore-lod-author-card parent-ctrl="$ctrl.parentCtrl"></primo-explore-lod-author-card>'
});


// End Altmetric plugin

// Add the chat button
//
// (function () {
//   var lc = document.createElement('script');lc.type = 'text/javascript';lc.async = 'true';
//   lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'northwestern.libanswers.com/load_chat.php?hash=8479f851eb63bff929998c6128b41b20';
//   var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(lc, s);
//
//   // End the chat button
// })();

//Auto generated code by primo app store DO NOT DELETE!!! -START-
/*
    hookName is a place holder with should hold the hook name not including "prm" at the beginning and in upper camel case
    e.g: for hook prmSearchBarAfter (in html prm-search-bar-after) it should be given "SearchBarAfter"
 */
app.controller('AccountLinksAfterController', [function () {
  var vm = this;
}]);

app.component('prmAccountLinksAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'AccountLinksAfterController',
  template: '\n    <prm-account-links-after-app-store-generated parent-ctrl="$ctrl.parentCtrl"></prm-account-links-after-app-store-generated>\n'

});

//Auto generated code by primo app store DO NOT DELETE!!! -END-

//Auto generated code by primo app store DO NOT DELETE!!! -START-
/*
    hookName is a place holder with should hold the hook name not including "prm" at the beginning and in upper camel case
    e.g: for hook prmSearchBarAfter (in html prm-search-bar-after) it should be given "SearchBarAfter"
 */
app.controller('FacetAfterController', [function () {
  var vm = this;
}]);

app.component('prmFacetAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'FacetAfterController',
  template: '\n    <prm-facet-after-app-store-generated parent-ctrl="$ctrl.parentCtrl"></prm-facet-after-app-store-generated>\n'

});

//Auto generated code by primo app store DO NOT DELETE!!! -END-

//Auto generated code by primo app store DO NOT DELETE!!! -START-
/*
    hookName is a place holder with should hold the hook name not including "prm" at the beginning and in upper camel case
    e.g: for hook prmSearchBarAfter (in html prm-search-bar-after) it should be given "SearchBarAfter"
 */
app.controller('FacetExactAfterController', [function () {
  var vm = this;
}]);

app.component('prmFacetExactAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'FacetExactAfterController',
  template: '\n    <prm-facet-exact-after-app-store-generated parent-ctrl="$ctrl.parentCtrl"></prm-facet-exact-after-app-store-generated>\n'

});

//Auto generated code by primo app store DO NOT DELETE!!! -END-

//Auto generated code by primo app store DO NOT DELETE!!! -START-
/*
    hookName is a place holder with should hold the hook name not including "prm" at the beginning and in upper camel case
    e.g: for hook prmSearchBarAfter (in html prm-search-bar-after) it should be given "SearchBarAfter"
 */
app.controller('LoansOverviewAfterController', [function () {
  var vm = this;
}]);

app.component('prmLoansOverviewAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'LoansOverviewAfterController',
  template: '\n    <prm-loans-overview-after-app-store-generated parent-ctrl="$ctrl.parentCtrl"></prm-loans-overview-after-app-store-generated>\n'

});

//Auto generated code by primo app store DO NOT DELETE!!! -END-

//Auto generated code by primo app store DO NOT DELETE!!! -START-
/*
    hookName is a place holder with should hold the hook name not including "prm" at the beginning and in upper camel case
    e.g: for hook prmSearchBarAfter (in html prm-search-bar-after) it should be given "SearchBarAfter"
 */
app.controller('LogoAfterController', [function () {
  var vm = this;
}]);

app.component('prmLogoAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'LogoAfterController',
  template: '\n    <prm-logo-after-app-store-generated parent-ctrl="$ctrl.parentCtrl"></prm-logo-after-app-store-generated>\n'

});

//Auto generated code by primo app store DO NOT DELETE!!! -END-

//Auto generated code by primo app store DO NOT DELETE!!! -START-
/*
    hookName is a place holder with should hold the hook name not including "prm" at the beginning and in upper camel case
    e.g: for hook prmSearchBarAfter (in html prm-search-bar-after) it should be given "SearchBarAfter"
 */
app.controller('MessagesAndBlocksOverviewAfterController', [function () {
  var vm = this;
}]);

app.component('prmMessagesAndBlocksOverviewAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'MessagesAndBlocksOverviewAfterController',
  template: '\n    <prm-messages-and-blocks-overview-after-app-store-generated parent-ctrl="$ctrl.parentCtrl"></prm-messages-and-blocks-overview-after-app-store-generated>\n'

});

//Auto generated code by primo app store DO NOT DELETE!!! -END-

//Auto generated code by primo app store DO NOT DELETE!!! -START-
/*
    hookName is a place holder with should hold the hook name not including "prm" at the beginning and in upper camel case
    e.g: for hook prmSearchBarAfter (in html prm-search-bar-after) it should be given "SearchBarAfter"
 */
app.controller('NoSearchResultAfterController', [function () {
  var vm = this;
}]);

app.component('prmNoSearchResultAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'NoSearchResultAfterController',
  template: '\n    <prm-no-search-result-after-app-store-generated parent-ctrl="$ctrl.parentCtrl"></prm-no-search-result-after-app-store-generated>\n'

});

//Auto generated code by primo app store DO NOT DELETE!!! -END-

//Auto generated code by primo app store DO NOT DELETE!!! -START-
/*
    hookName is a place holder with should hold the hook name not including "prm" at the beginning and in upper camel case
    e.g: for hook prmSearchBarAfter (in html prm-search-bar-after) it should be given "SearchBarAfter"
 */
app.controller('PageNavMenuAfterController', [function () {
  var vm = this;
}]);

app.component('prmPageNavMenuAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'PageNavMenuAfterController',
  template: '\n    <prm-page-nav-menu-after-app-store-generated parent-ctrl="$ctrl.parentCtrl"></prm-page-nav-menu-after-app-store-generated>\n'

});

//Auto generated code by primo app store DO NOT DELETE!!! -END-

//Auto generated code by primo app store DO NOT DELETE!!! -START-
/*
    hookName is a place holder with should hold the hook name not including "prm" at the beginning and in upper camel case
    e.g: for hook prmSearchBarAfter (in html prm-search-bar-after) it should be given "SearchBarAfter"
 */
app.controller('SearchBarAfterController', [function () {
  var vm = this;
}]);

app.component('prmSearchBarAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'SearchBarAfterController',
  template: '\n    <prm-search-bar-after-app-store-generated parent-ctrl="$ctrl.parentCtrl"></prm-search-bar-after-app-store-generated>\n'

});

//Auto generated code by primo app store DO NOT DELETE!!! -END-

//Auto generated code by primo app store DO NOT DELETE!!! -START-
/*
    hookName is a place holder with should hold the hook name not including "prm" at the beginning and in upper camel case
    e.g: for hook prmSearchBarAfter (in html prm-search-bar-after) it should be given "SearchBarAfter"
 */
app.controller('SearchResultAvailabilityLineAfterController', [function () {
  var vm = this;
}]);

app.component('prmSearchResultAvailabilityLineAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'SearchResultAvailabilityLineAfterController',
  template: '\n    <prm-search-result-availability-line-after-app-store-generated parent-ctrl="$ctrl.parentCtrl"></prm-search-result-availability-line-after-app-store-generated>\n'

});

//Auto generated code by primo app store DO NOT DELETE!!! -END-

//Auto generated code by primo app store DO NOT DELETE!!! -START-
/*
    hookName is a place holder with should hold the hook name not including "prm" at the beginning and in upper camel case
    e.g: for hook prmSearchBarAfter (in html prm-search-bar-after) it should be given "SearchBarAfter"
 */
app.controller('TopbarAfterController', [function () {
  var vm = this;
}]);

app.component('prmTopbarAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'TopbarAfterController',
  template: '\n <div id="TopbarAfterSiteTitle"><a href="https://galter.northwestern.edu">Galter Health Sciences Library & Learning Center</a></div>\n    <prm-topbar-after-app-store-generated parent-ctrl="$ctrl.parentCtrl"></prm-topbar-after-app-store-generated>\n'

});

//Auto generated code by primo app store DO NOT DELETE!!! -END-
})();
