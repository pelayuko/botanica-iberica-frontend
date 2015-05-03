
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
    	return $location.path('/genus').search('query=' + val);
    }; 
    this.searchFamily = function(val) {
    	return $location.path('/family').search('query=' + val);
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
    		return $route.reload();
    	} else {
        	console.log('Redirect');
    		return $location.path('/specy');   		
    	}
	};
});

