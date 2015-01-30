// TO CFG!!
var serverUrl = "http://192.168.1.111:8080";
var flora = angular.module('flora', ['ngAnimate', 'ngRoute', 'angularUtils.directives.dirPagination', 'uiGmapgoogle-maps', 'angularBootstrapNavTree']);


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
	  templateUrl: "templates/navbar.html",
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

flora.controller('TreeCtrl', function ($scope, $http) {
//	 $scope.my_tree_handler = {};
//	 $scope.my_tree = {};
	$scope.my_treedata = [{
		label: 'North America',
		children: [
		  {
		    label: 'Canada',
		    children: ['Toronto', 'Vancouver']
		  }, {
		    label: 'USA',
		    children: ['New York', 'Los Angeles']
		  }, {
		    label: 'Mexico',
		    children: ['Mexico City', 'Guadalajara']
		      }
		    ]
		  }, {
		    label: 'South America',
		children: [
		  {
		    label: 'Venezuela',
		    children: ['Caracas', 'Maracaibo']
		  }, {
		    label: 'Brazil',
		    children: ['Sao Paulo', 'Rio de Janeiro']
		  }, {
		    label: 'Argentina',
		    children: ['Buenos Aires', 'Cordoba']
		      }
		    ]
		  }
		];	
});

flora.controller('MainCtrl', function ($scope, $http) {
	
	$http.get(serverUrl + '/randomPhotoLandscape').
	  success(function(data, status, headers, config) {
	    // this callback will be called asynchronously
	    // when the response is available
		  $scope.randomPhotoLandscapeUrl = data.location;
		  $scope.randomPhotoLandscape = data.content;

	  }).
	  error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	  });
	$http.get(serverUrl + '/randomPhotoFlower').
	  success(function(data, status, headers, config) {
	    // this callback will be called asynchronously
	    // when the response is available
		  $scope.randomPhotoFlowerUrl = data.location;
		  $scope.randomPhotoFlower = data.content;

	  }).
	  error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
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
    				latitude: 40.454018, 
    				longitude: -3.509205
    			}, 
    			zoom: 12,
    			options : {
    				scrollwheel: false
    			},
    			control: {}
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

flora.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('components/pagination/dirPagination.tpl.html');
});

flora.service('CitasService', function($http) {
    this.fetch = function(pageNumber, pageSize, sort) {
    	return $http.get(serverUrl + '/citas?page=' + pageNumber + '&size=' + pageSize + '&sort=' + sort);
    };
     
    this.subtract = function(a, b) { return a - b };
});


function DenomListController($scope, $http, CitasService) {

    $scope.citasList = [];
    $scope.totalCitasList = 0;
    $scope.pageSize = 10; // this should match however many results your API puts on one page
    var sort = $scope.sort||'id';

    getResultsPage(1); 
    
    $scope.pagination = {
            current: 1
    };
    
	$scope.pageChangeHandler = function(num) {
		console.log('1 going to page ' + num);
		getResultsPage(num);
	};
	
    function getResultsPage(pageNumber) {
    	CitasService.fetch(pageNumber, $scope.pageSize, sort).then(function(result) {
            $scope.citasList = result.data.content;
            $scope.totalCitasList = result.data.totalElements;
        });
    }
 
}

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
flora.controller('DenomListController', DenomListController);




