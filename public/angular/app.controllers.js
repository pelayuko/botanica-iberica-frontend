

flora.controller('MainCtrl', function ($scope, $http, $location, NavigationService) {
	$scope.nav = NavigationService;
//	$scope.modelMain ={};
//	$scope.modelMain.inicial = 0;
	
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
	        		  $location.path('/family').search('query=' + $item.taxon.nombre);
	        	  }  else if ($item.type == 'ZONA') {
	        		  $location.path('/zone').search({zone : $item.result, sector : '-'});
	        	  }  else {
	        		  $location.path('/parajes');
	        	  }
	          }
		};
		
		$http.get( serverUrl + "/numeroEspecies" , {
		      params: {
		      }
		    }).then(function(response){
		    	$scope.numeroEspecies = response.data;
		 });
		
		$http.get( serverUrl + "/numeroCitas" , {
		      params: {
		      }
		    }).then(function(response){
		    	$scope.numeroCitas = response.data;
		 });
		
		$http.get( serverUrl + "/numeroZonas" , {
		      params: {
		      }
		    }).then(function(response){
		    	$scope.numeroZonas = response.data;
		 });
		
		$http.get( serverUrl + "/numeroFotosPlantas" , {
		      params: {
		      }
		    }).then(function(response){
		    	$scope.numeroFotosPlantas = response.data;
		 });

		$http.get( serverUrl + "/numeroFotosLugares" , {
		      params: {
		      }
		    }).then(function(response){
		    	$scope.numeroFotosLugares = response.data;
		 });
		
		$http.get( serverUrl + "/datosDeInicioZon" , {
		      params: {
		    	  count: 1
		      }
		    }).then(function(response){
		    	$scope.fotosZona = response.data;
		 });
		
		$http.get( serverUrl + "/datosDeInicioEsp" , {
		      params: {
		    	  count: 1
		      }
		    }).then(function(response){
		    	$scope.fotosEspecie = response.data;
		 });
});

/*
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
*/

flora.controller('MapCtrl', function ($scope, $location, $http, $timeout, NavigationService) {
	$scope.nav = NavigationService;
//	$scope.inicial = 0;
	
	$scope.zones = [];
	
	acur = 1000;
	
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
	
	$scope.searchZoneFromUTM = function (utmParm) {
		$location.path('/zone').search({utm : utmParm, sector : $scope.selectedSector});
	};
	
    $scope.loadSearchMapTab = function() {
    	$scope.loadZonesFromSector('A');
		$timeout(function() {
			createMap("search", "map_canvas");
			loadSectorGrid(true);
			loadAllUTMsSector();
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

flora.controller('FotosCtrl', function ($scope, $location, $http, $timeout, NavigationService) {
	$scope.nav = NavigationService;
	  
	  $scope.getSearchResults = function(val) {
		  return $http.get( serverUrl + "/searchTemas" , {
		      params: {
		    	  clave: val, //.replace(/ /g, "+"),
		    	  limit: 10
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
	        		  $location.path('/fotos').search('query=' + $item);
	          }
		};	

    if ( $location.search().query ) {
	    	 
		$http.get( serverUrl + "/datosDeInicioTema" , {
		      params: {
		    	  tema: $location.search().query
		      }
		    }).then(function(response){
		    	$scope.fotos = response.data;
		 });		  
  } else {
	  $http.get( serverUrl + "/datosDeInicioTema" , {
	      params: {
	    	  tema: ""
	      }
	    }).then(function(response){
	    	$scope.fotos = response.data;
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


flora.controller('SpecyCtrl', function($scope, $http, $location, $timeout, NavigationService, UtilService) {
	$("#top-search").val('');
	$scope.nav = NavigationService;
	$scope.util = UtilService;
	$scope.modelSpecy = {};
	$scope.JacaEnabled = JacaEnabled;
//	$scope.inicial = 0;
	
//	$scope.$on('$viewContentLoaded', function(){
//		updateOffset("map_canvas");
//	  });
	
	$scope.searchZone = function (zoneParam, sectorParam) {
		$location.path('/zone').search({zone : zoneParam, sector : sectorParam});
	};
	
	$scope.loadGMap = function(especie) {
		$timeout(function() {
//			$('#dvLoading').fadeOut(1000);
			createMap("view", "map_canvas");
			loadSectorGrid(false);
			loadUTMsTaxon(especie); //$location.search().query);
				// $scope.$apply();
		  }, 0);		

	};

	$scope.filtrarPorFamilia = function(familia) {
		if ($("#iconFiltroFam").is(":visible")) {
			UtilService.elFiltro = "";
			$("#iconFiltroFam").hide();
		}
		else {
			UtilService.elFiltro = " and Familia = '" + familia + "'";
			$("#iconFiltroFam").show();
			$("#iconFiltroGen").hide();
		}
	};
	  
	$scope.filtrarPorGenero = function(genero) {
		if ($("#iconFiltroGen").is(":visible")) {
			UtilService.elFiltro = "";
			$("#iconFiltroGen").hide();
		}
		else {
			UtilService.elFiltro = " and Género = '" + genero + "'";
			$("#iconFiltroGen").show();
			$("#iconFiltroFam").hide();
		}
	};
	
	$scope.gestionaIconFiltros = function() {
		$("#iconFiltroFam").hide();
		$("#iconFiltroGen").hide();
		if (UtilService.elFiltro.indexOf("Género") === 5) $("#iconFiltroGen").show();
		else if (UtilService.elFiltro.indexOf("Familia") === 5) $("#iconFiltroFam").show();
	};

	  if ( $location.search().query ) {
		  	var suffix = "";
		  	if ($location.search().relative){
		  		suffix = $location.search().relative;
		  	}
		  	else {
		  		UtilService.elFiltro = "";
		  	}
		  	 
			$http.get( serverUrl + "/datosDeEspecie" + suffix, {
			      params: {
			    	  ident: $location.search().query,
			    	  filtro: UtilService.elFiltro
			      }
			    }).then(function(response){
			    	$scope.modelSpecy = response.data;
			    	$scope.loadGMap($scope.modelSpecy.datosTaxon.nombre);
			    	$scope.gestionaIconFiltros();
			 });		  
	  } else {
			$http.get( serverUrl + "/datosDeEspecieRandom", {
			      params: {
			    	  filtro: UtilService.elFiltro
			      }
			    }).then(function(response){
			    	$scope.modelSpecy = response.data;
			    	$scope.loadGMap($scope.modelSpecy.datosTaxon.nombre);
			    	$scope.gestionaIconFiltros();
			 });		  
	  }
});

flora.controller('FamilyCtrl', function($scope, $http, $location, NavigationService, UtilService) {
	$("#top-search").val('');
	$scope.nav = NavigationService;
	$scope.util = UtilService;
	$scope.modelFamily = {};

	  $scope.currentPage = 1;
	  $scope.pageSize = 10;
	
	$http.get( serverUrl + "/datosDeFamilia" , {
	      params: {
	    	  family: $location.search().query
	      }
	    }).then(function(response){
	    	$scope.modelFamily = response.data;
	    	$scope.refFloraIberica = $scope.modelFamily.refFloraIberica;

	 });
	
	$http.get( serverUrl + "/taxonesDeFamilia" , {
	      params: {
	    	  family: $location.search().query,
	      }
	    }).then(function(response){
	    	$scope.modelFamily.especies = response.data;
	 });	
	
	$http.get( serverUrl + "/generosDeFamilia" , {
	      params: {
	    	  family: $location.search().query,
	      }
	    }).then(function(response){
	    	$scope.modelFamily.generos = response.data;
	 });
});

flora.controller('GenusCtrl', function($scope, $http, $location, NavigationService) {
	$("#top-search").val('');
	$scope.nav = NavigationService;
	$scope.modelGenus = {};

	  $scope.currentPage = 1;
	  $scope.pageSize = 10;

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
	  
//	$scope.$on('$viewContentLoaded', function(){
//	    //Here your view content is fully loaded !!
//		//TableService.prepareTable("miTabla");
//	  });
	
	$scope.loadGMap = function() {
		$timeout(function() {
//			$('#dvLoading').fadeOut(2000);
			createMap("view", "map_canvas");

			loadSectorGrid(false);
			loadUTMsZona($location.search().zone);
			
				// $scope.$apply();
		  }, 0);
	  };

	  if ( $location.search().utm ) {
		  
			$http.get( serverUrl + "/datosDeZonaFromUTM", {
			      params: {
			    	  utm: $location.search().utm,
			    	  sector: $location.search().sector
			      }
			    }).then(function(response){
			    	$scope.modelZone = response.data;
			    	$scope.loadGMap();
			 });
		  
			$http.get( serverUrl + "/taxonesDeZonaFromUTM", {
			      params: {
			    	  utm: $location.search().utm,
			    	  sector: $location.search().sector
			      }
			    }).then(function(response){
			    	$scope.modelZone.especies = response.data;
			 });	
			
			
	  } else {
		  $http.get( serverUrl + "/datosDeZona" , {
		      params: {
		    	  zona: $location.search().zone,
		    	  sector: $location.search().sector
		      }
		    }).then(function(response){
		    	$scope.modelZone = response.data;
		    	$scope.loadGMap();
		 });	
		  
		  $http.get( serverUrl + "/taxonesDeZona" , {
		      params: {
		    	  zona: $location.search().zone,
		    	  sector: $location.search().sector
		      }
		    }).then(function(response){
		    	$scope.modelZone.especies = response.data;
		 });	
	  }
	
	
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
	    	$scope.modelUTM = response.data;
	 });
	
	 $http.get( serverUrl + "/taxonesDeUtm" , {
	      params: {
	    	  utm: $scope.utm
	      }
	    }).then(function(response){
	    	$scope.modelUTM.especies = response.data;
	 });
});

flora.controller('TreeCtrl', function($scope, $http, $location, $timeout) {
	// FIXME: migrate logic to angular
	loadTaxonTree('grupo', 'root');
	
});

flora.controller('AdvancedSearchCtrl', function($scope, $http, $location, NavigationService) {
	$scope.nav = NavigationService;
	
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
	        		  $location.path('/parajes');
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
