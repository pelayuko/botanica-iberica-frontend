

flora.controller('MainCtrl', function ($scope, $http, $location) {
	  $scope.getSearchResults = function(val) {
		    return $http.get( serverUrl + "/searchAll" , {
		      params: {
		    	  nombre: val, //.replace(/ /g, "+"),
		    	  limit: $scope.limit || 10
		      }
		    }).then(function(response){
		      return response.data;
		    });
		  };		  
		  
	  $scope.onSelect = function ($item, $model, $label) {
		    $scope.$item = $item;
		    $scope.$model = $model;
		    $scope.$label = $label;
	          if ($item) {
	        	  if ( $item.type.indexOf('ESPECIE') == 0 ) {
	        		  $location.path('/specy').search('query=' + $item.taxon.nombre);
	        	  } else if ($item.type == 'GENERO') {
	        		  $location.path('/genus').search('query=' + $item.result);
	        	  } else if ($item.type == 'FAMILIA') {
	        		  $location.path('/family').search('query=' + $item.result);
	        	  }  else if ($item.type == 'ZONA') {
	        		  $location.path('/zone').search({zone : $item.result, sector : '-'});
	        	  }  else {
	        		  $location.path('/map');
	        	  }
	          }
		};
});

flora.controller('MapAngularCtrl', function ($scope, uiGmapGoogleMapApi) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
    	$scope.map = {
    			center: {
    				latitude: 41.76, 
    				longitude: -1.63
    			}, 
    			zoom: 10,
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

flora.controller('MapCtrl', function ($scope, $location, $http, $timeout) {
	$scope.zones = [];
	
	  $(".dropdown-menu li a").click(function(){
		  var selText = $(this).text();
//		  $("#zonasearchButton").attr("data", $(this).closest("li").attr("id"));
		  $("#zonasearchButton").css("background-color", $(this).closest("li").css("background-color"));
		  $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+'<span class="caret"></span>');
		});
	
	  $scope.loadZonesFromSector = function(sector) {
		  $scope.selectedSector = sector;
		    return $http.get( serverUrl + "/zonasBySector" , {
		    	params: {
		    		sector: sector
	      }
	    }).then(function(response){
	    	$scope.zones = response.data;
	    });
	  };
	  
	$scope.searchZone = function (zoneParm) {
		$location.path('/zone').search({zone : zoneParm, sector : $scope.selectedSector});
	};
	
    $scope.loadSearchMapTab = function() {
    	$scope.loadZonesFromSector('A');
		$timeout(function() {
			createMap("search", "map_canvas");
			loadSectorGrid(true);
			document.getElementById("zonasearchButton").style.background = "lightpink";		
			
				// $scope.$apply();
		  }, 0);	   	
    };
    $scope.loadSearchMapTab();

	$http.get( serverUrl + "/datosDeInicioZon" , {
	      params: {
	      }
	    }).then(function(response){
	    	$scope.fotos = response.data;
	 });
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


flora.controller('SpecyCtrl', function($scope, $http, $location, $timeout, NavigationService, UtilService) {
	$("#top-search").val('');
	$scope.nav = NavigationService;
	$scope.util = UtilService;
	$scope.modelSpecy = {};
	
	$scope.searchZone = function (zoneParam, sectorParam) {
		$location.path('/zone').search({zone : zoneParam, sector : sectorParam});
	};
	
	$scope.loadGMap = function(especie) {
		$timeout(function() {
			$('#dvLoading').fadeOut(2000);
			createMap("view", "map_canvas");
			loadUTMGrid();
			loadUTMsTaxon(especie); //$location.search().query);
				// $scope.$apply();
		  }, 0);		

	  };
	
	  if ( $location.search().query ) {
		  	var suffix = "";
		  	if ($location.search().relative){
		  		suffix = $location.search().relative;
		  	}
		  
			$http.get( serverUrl + "/datosDeEspecie" + suffix, {
			      params: {
			    	  ident: $location.search().query
			      }
			    }).then(function(response){
			    	$scope.modelSpecy = response.data;
			    	$scope.loadGMap($scope.modelSpecy.datosTaxon.nombre);
			 });		  
	  } else {
			$http.get( serverUrl + "/datosDeEspecieRandom").then(function(response){
			    	$scope.modelSpecy = response.data;
			    	$scope.loadGMap($scope.modelSpecy.datosTaxon.nombre);
			 });		  
	  }
});

flora.controller('FamilyCtrl', function($scope, $http, $location, NavigationService) {
	$("#top-search").val('');
	$scope.nav = NavigationService;
	$scope.modelFamily = {};
	
	$http.get( serverUrl + "/datosDeFamilia" , {
	      params: {
	    	  family: $location.search().query
	      }
	    }).then(function(response){
	    	$scope.modelFamily = response.data;
	    	$scope.refFloraIberica = $scope.modelFamily.refFloraIberica;

	 });
});

flora.controller('GenusCtrl', function($scope, $http, $location, NavigationService) {
	$("#top-search").val('');
	$scope.nav = NavigationService;
	$scope.modelGenus = {};
	
	$http.get( serverUrl + "/datosDeGenero" , {
	      params: {
	    	  genus: $location.search().query
	      }
	    }).then(function(response){
	    	$scope.modelGenus = response.data;
	    	$scope.refFloraIberica = $scope.modelGenus.refFloraIberica;
	 });
});

flora.controller('ZoneCtrl', function($scope, $http, $location, $timeout, NavigationService, UtilService) {
	$("#top-search").val('');
	$scope.nav = NavigationService;
	$scope.util = UtilService;
	$scope.modelZone = {};
	
	  $scope.currentPage = 1;
	  $scope.pageSize = 10;
	  
	$scope.$on('$viewContentLoaded', function(){
	    //Here your view content is fully loaded !!
		//TableService.prepareTable("miTabla");
	  });
	
	$scope.loadGMap = function() {
		$timeout(function() {
			$('#dvLoading').fadeOut(2000);
			createMap("view", "map_canvas");

			loadUTMGrid();
			loadUTMsZona($location.search().zone);
			
				// $scope.$apply();
		  }, 0);
	  };
	
	$http.get( serverUrl + "/datosDeZona" , {
	      params: {
	    	  zona: $location.search().zone,
	    	  sector: $location.search().sector
	      }
	    }).then(function(response){
	    	$scope.modelZone = response.data;
	    	$scope.loadGMap();
	 });
	
});

flora.controller('UTMCtrl', function($scope, $http, $location, NavigationService) {
	$scope.nav = NavigationService;
	$scope.utm = $location.search().utm;
	
	  $scope.currentPage = 1;
	  $scope.pageSize = 10;
	  
	$http.get( serverUrl + "/datosDeUtm" , {
	      params: {
	    	  utm: $scope.utm
	      }
	    }).then(function(response){
	    	$scope.taxonList = response.data;
	 });
});

flora.controller('TreeCtrl', function($scope, $http, $location, $timeout) {
	// FIXME: migrate logic to angular
	loadTaxonTree('grupo', 'root');
	
});

flora.controller('AdvancedSearchCtrl', function($scope, $http, $location) {
	
	$http.get( serverUrl + "/datosDeInicioEsp" , {
	      params: {
	      }
	    }).then(function(response){
	    	$scope.fotos = response.data;
	 });
	
	$scope.searchModel = undefined;
	  
	  $(".dropdown-menu li a").click(function(){
		  var selText = $(this).text();
		  $("#taxonSearchButton").attr("data", $(this).closest("li").attr("id"));
		  $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+'<span class="caret"></span>');
		});
	  
	  $scope.getResults = function(val) {
		    return $http.get( serverUrl + "/search" +  $("#taxonSearchButton").attr("data") , {
		      params: {
		    	  nombre: val, //.replace(/ /g, "+"),
		    	  limit: $scope.limit || 10
		      }
		    }).then(function(response){
		      return response.data;
		    });
		  };
		  
	  $scope.onSelect = function ($item, $model, $label) {
		    $scope.$item = $item;
		    $scope.$model = $model;
		    $scope.$label = $label;
	          if ($item) {
	        	  if ( $item.type.indexOf('ESPECIE') == 0 ) {
	        		  $location.path('/specy').search('query=' + $item.taxon.nombre);
	        	  } else if ($item.type == 'GENERO') {
	        		  $location.path('/genus').search('query=' + $item.result);
	        	  } else if ($item.type == 'FAMILIA') {
	        		  $location.path('/family').search('query=' + $item.result);
	        	  } else if ($item.type == 'ZONA') {
	        		  $location.path('/zone').search({zone : $item.result, sector : '-'});
	        	  }  else {
	        		  $location.path('/map');
	        	  }
	          }
		};

});


flora.controller('LetterCtrl', function($scope, $http, $location, NavigationService) {
	$scope.nav = NavigationService;
	
	$scope.abecedario = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
			'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
			'x', 'y', 'z' ];

	$scope.loadLetter = function(letter) {
		return $http.get(
				serverUrl + "/searchAcceptedStarting", {
					params : {
						nombre : letter
					}
				}).then(function(response) {
					$scope.species = response.data;
		});
	};

	$scope.loadLetter('a');

});
