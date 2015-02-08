// 'use strict';

// TO CFG!!
var serverUrl = "http://192.168.1.111:8080";
var flora = angular.module('flora', ['ngAnimate',
                                     'ngRoute',
                                     'angularUtils.directives.dirPagination',
                                     'uiGmapgoogle-maps',
                                     'angularBootstrapNavTree', 
                                     'ui.bootstrap.typeahead']);


/**
 * Configure the Routes
 */
flora.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/main.html", controller: "MainCtrl"})
    // Pages
    .when("/denom", {templateUrl: "partials/list.html", controller: "DenomListController"})
    .when("/map", {templateUrl: "partials/map.html", controller: "MapCtrl"})
    .when("/treeSearch", {templateUrl: "partials/treeSearch.html", controller: "TreeCtrl"})
    .when("/search", {templateUrl: "partials/search.html", controller: "TypeaheadCtrl"})
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    .when("/faq", {templateUrl: "partials/faq.html", controller: "PageCtrl"})
    .when("/pricing", {templateUrl: "partials/pricing.html", controller: "PageCtrl"})
    .when("/services", {templateUrl: "partials/services.html", controller: "PageCtrl"})
    .when("/contact", {templateUrl: "partials/contact.html", controller: "PageCtrl"})
    // Blog
    .when("/blog", {templateUrl: "partials/blog.html", controller: "BlogCtrl"})
    .when("/blog/post", {templateUrl: "partials/blog_item.html", controller: "BlogCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

flora.directive("bootstrapNavbar", function() {
	return {
	  restrict: "E",
	  replace: true,
	  transclude: true,
	  templateUrl: "template/navbar.html",
	  compile: function(element, attrs) {  // (1)
	    var li, liElements, links, index, length;
	
	    liElements = $(element).find("#navigation-tabs li");   // (2)
	    for (index = 0, length = liElements.length; index < length; index++) {
	      li = liElements[index];
	      links = $(li).find("a");  // (3)
	      if (links[0].textContent === attrs.currentTab) $(li).addClass("active"); // (4)
	    }
	  }
	}});
;

flora.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});


flora.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('components/pagination/dirPagination.tpl.html');
});

flora.service('CitasService', function($http) {
    this.getCitas = function(pageNumber, pageSize, sort) {
    	return $http.get(serverUrl + '/citas?page=' + pageNumber + '&size=' + pageSize + '&sort=' + sort);
    };
});

flora.service('FamiliasService', function($http) {
    this.getFamilias = function() {
    	return $http.get(serverUrl + '/familias');
    };
    this.getNombresFamilias = function() {
    	return $http.get(serverUrl + '/nombresFamilias');
    };
});

flora.service('PhotoService', function($http) {
    this.getRandomPhotoFlower = function() {
    	return $http.get(serverUrl + '/randomPhotoFlower');
    };
    this.getRandomPhotoLandscape = function() {
    	return $http.get(serverUrl + '/randomPhotoLandscape');
    };
});

flora.service('TreeService', function($http) {
	this.newTreeElement = function(name, children) {
		var el = {};
		el.label = name;
		el.children = children;
    	return el;
    };
});

flora.controller('TreeCtrl', function ($scope, $http, FamiliasService, TreeService, PhotoService) {
    $scope.focusFamilia = function(event) {
    	console.log("Key pressed " + event);
    	var el = $("#Crasuláceas");
    	console.log("Selected element to focus " + el);
    	//angular.element("#Crasuláceas").focus();  
    	
    	$('html, body').animate({
    	    scrollTop: ($("#Crasuláceas").offset().top)
    	},500);
    };
	
	$scope.my_treedata = [];
    $scope.my_tree_handler = function(branch) {
    	console.log("Event in branch " + branch);
    	
    	PhotoService.getRandomPhotoFlower().
	  	  success(function(data, status, headers, config) {
	  		  $scope.randomPhotoFlowerInTree = data.content;
	  	  });    	
    };
    $scope.my_tree_handler();
	
    FamiliasService.getFamilias().
	  success(function(data, status, headers, config) {
		  	var families;
		    for (index = 0, length = data.length; index < length; index++) {
		    	var fam = data[index];
		    	
		    	var generos = [];
		    	for (i = 0; i < fam.generos.length; ++i) {
		    		generos.push(fam.generos[i].nombreGen);
		    	}
		    	
		    	var branch = TreeService.newTreeElement(fam.nombreFam, generos);
		    	
		    	$scope.my_treedata.push(branch);
		    }

	  });
});

flora.controller('MainCtrl', function ($scope, $http, PhotoService) {
	PhotoService.getRandomPhotoLandscape().
	  success(function(data, status, headers, config) {
		  $scope.randomPhotoLandscapeUrl = data.location;
		  $scope.randomPhotoLandscape = data.content;

	  });
	
	PhotoService.getRandomPhotoFlower().
	  success(function(data, status, headers, config) {
		  $scope.randomPhotoFlowerUrl = data.location;
		  $scope.randomPhotoFlower = data.content;

	  });
});

flora.controller('MapCtrl', function ($scope, uiGmapGoogleMapApi) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
    	$scope.map = {
    			center: {
    				latitude: 41.76106872528615, 
    				longitude: -1.218109130859375
    			}, 
    			zoom: 9,
    			options : {
    				scrollwheel: false
    			},
    			control: {},
    			events: {
    				//This turns of events and hits against scope from gMap events this does speed things up
    				// adding a blacklist for watching your controller scope should even be better
    				// blacklist: ['drag', 'dragend','dragstart','zoom_changed', 'center_changed'],
			        tilesloaded: function (map, eventName, originalEventArgs) {
			        	//console.log( 'Titles loaded' );
			        },
			        click: function (mapModel, eventName, originalEventArgs) {
			        	console.log( 'Click!' );
			        	 var e = originalEventArgs[0];
			             var lat = e.latLng.lat(),
			               lon = e.latLng.lng();
			    	    console.log( lat + ', ' + lon );
			        }
    			}
    	};
    	$scope.marker = {
    			id: 0,
    			coords: {
    				latitude: 40.454018,
    				longitude: -3.509205
    			},
    			options: {
    				draggable: true
    			}
    	};
    	
    });	 
});


flora.controller('DenomListController', function DenomListController($scope, $http, CitasService) {

    $scope.citasList = [];
    $scope.totalCitasList = 0;
    $scope.pageSize = 10; // this should match however many results your API puts on one page
    var sort = $scope.sort||'id';

    getResultsPage(0); 
    
    $scope.pagination = {
            current: 0
    };
    
	$scope.pageChangeHandler = function(num) {
		console.log('going to page ' + num);
		getResultsPage(num);
	};
	
    function getResultsPage(pageNumber) {
    	CitasService.getCitas(pageNumber, $scope.pageSize, sort).then(function(result) {
            $scope.citasList = result.data.content;
            $scope.totalCitasList = result.data.totalElements;
        });
    }
 
});


/**
 * Controls all other Pages
 */
flora.controller('PageCtrl', function (/* $scope, $location, $http */) {
  console.log("Page Controller reporting for duty.");

  // Activates the Carousel
  $('.carousel').carousel({
    interval: 5000
  });
});



flora.controller('TypeaheadCtrl', function($scope, $http, FamiliasService) {

	  $scope.selected = undefined;
	  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
	  // Any function returning a promise object can be used to load values asynchronously
	  $scope.getLocation = function(val) {
	    return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
	      params: {
	        address: val,
	        sensor: false
	      }
	    }).then(function(response){
	      return response.data.results.map(function(item){
	        return item.formatted_address;
	      });
	    });
	  };
	
	  $scope.statesWithFlags = [{'name':'Alabama','flag':'5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},{'name':'Alaska','flag':'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},{'name':'Arizona','flag':'9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},{'name':'Arkansas','flag':'9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},{'name':'California','flag':'0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},{'name':'Colorado','flag':'4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},{'name':'Connecticut','flag':'9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},{'name':'Delaware','flag':'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},{'name':'Florida','flag':'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},{'name':'Georgia','flag':'5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'},{'name':'Hawaii','flag':'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'},{'name':'Idaho','flag':'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'},{'name':'Illinois','flag':'0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'},{'name':'Indiana','flag':'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'},{'name':'Iowa','flag':'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'},{'name':'Kansas','flag':'d/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'},{'name':'Kentucky','flag':'8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'},{'name':'Louisiana','flag':'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'},{'name':'Maine','flag':'3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'},{'name':'Maryland','flag':'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'},{'name':'Massachusetts','flag':'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'},{'name':'Michigan','flag':'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'},{'name':'Minnesota','flag':'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'},{'name':'Mississippi','flag':'4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'},{'name':'Missouri','flag':'5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'},{'name':'Montana','flag':'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'},{'name':'Nebraska','flag':'4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'},{'name':'Nevada','flag':'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'},{'name':'New Hampshire','flag':'2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'},{'name':'New Jersey','flag':'9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'},{'name':'New Mexico','flag':'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'},{'name':'New York','flag':'1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'},{'name':'North Carolina','flag':'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'},{'name':'North Dakota','flag':'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'},{'name':'Ohio','flag':'4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'},{'name':'Oklahoma','flag':'6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'},{'name':'Oregon','flag':'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'},{'name':'Pennsylvania','flag':'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'},{'name':'Rhode Island','flag':'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'},{'name':'South Carolina','flag':'6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'},{'name':'South Dakota','flag':'1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'},{'name':'Tennessee','flag':'9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'},{'name':'Texas','flag':'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'},{'name':'Utah','flag':'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'},{'name':'Vermont','flag':'4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'},{'name':'Virginia','flag':'4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'},{'name':'Washington','flag':'5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'},{'name':'West Virginia','flag':'2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'},{'name':'Wisconsin','flag':'2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'},{'name':'Wyoming','flag':'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'}];
	
	  FamiliasService.getNombresFamilias().
	  	success(function(data, status, headers, config) {
		  	$scope.nombresFamilias = data;
	  });
});
