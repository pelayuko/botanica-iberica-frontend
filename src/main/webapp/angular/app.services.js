
flora.service('CitasService', function($http) {
    this.getCitas = function(pageNumber, pageSize, sort) {
    	return $http.get(serverUrl + '/citas?page=' + pageNumber + '&size=' + pageSize + '&sort=' + sort);
    };
});


flora.service('PhotoService', function($http) {
    this.getRandomPhotoFlower = function(size) {
    	return $http.get(serverUrl + '/randomPhotoFlower?size=' + size);
    };
    
    this.getRandomPhotoFlowerByTag = function(tag, size) {
    	return $http.get(serverUrl + '/randomPhotoFlowerByTag?tag=' + tag + '&size=' + size);
    };

    this.getRandomPhotoLandscape = function(size) {
    	return $http.get(serverUrl + '/randomPhotoLandscape?size=' + size);
    };
});

flora.service('NavigationService', function($location, $http, $route) {

    this.searchSpecy = function(val) {
    	return $location.path('/specy').search('query=' + val);
    };
    this.searchGenus = function(val) {
    	if (val.indexOf(" ") > 0) val = val.substr(0,val.indexOf(" ")); //admite nombres de especie
    	return $location.path('/genus').search('query=' + val);
    }; 
    this.searchFamily = function(val) {
    	return $location.path('/family').search('query=' + val);
    };
    this.searchUTM = function(val) {
    	return $location.path('/utm').search('utm=' + val);
    };
    
    this.previousSpecy = function(val) {
    	return $location.path('/specy').search({query : val, relative : 'Prev'});
    };
    
    this.nextSpecy = function(val) {
    	return $location.path('/specy').search({query : val, relative : 'Next'});
    };
    
    this.randomSpecy = function () {
    	var path = $location.path();
    	console.log('Estoy en ' + path);
    	if ( path == '/specy') {
        	console.log('Reload');
        	$location.path('/specy').search({});
    		return $route.reload();
    	} else {
        	console.log('Redirect');
    		return $location.path('/specy');   		
    	}
	};
});

flora.service('UtilService', function($location, $http, $route) {
//    this.verTodas = function(val) {
//    	console.log('Valor es ' + val);
//    	console.log('height ' + $("#photoContainer").css('height'));
//    	if (val != $("#photoContainer").css('height')) {	
//        	$("#photoContainer").css('height', val);
//        	$("#verTodasSwitcher").text('Expandir');   
//    	} else {
//        	$("#photoContainer").css('height', 'auto');
//        	$("#verTodasSwitcher").text('Colapsar');     	
//    	}
//    };
    
	this.getGenus = function(val) {
	    return val.substr(0,val.indexOf(" "));
	};
	
	this.photoLimit=4;
	this.imageToggleText="Ver más";
	
	this.changePhotoLimit = function () {
		if (this.photoLimit == 4) {
			this.imageToggleText="Ver menos";
			this.photoLimit=100;
		} else {
			this.imageToggleText="Ver más";
			this.photoLimit=4;
		}
	};   
	
	this.elFiltro="";
});
