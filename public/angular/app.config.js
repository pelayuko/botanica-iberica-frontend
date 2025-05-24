// TO CFG!!
//var serverUrl = "http://192.168.1.5:8080";
//var serverUrl = "http://192.168.1.16:8080";
//var serverUrl = "54.88.136.216";



// var serverUrl = "http://botanica-iberica-backend-estepasyhayedos.1d35.starter-us-east-1.openshiftapps.com";
var serverUrl = "http://localhost:8080";
var JacaEnabled = false;

/**
 * Configure the Routes
 */
flora.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/header.html", controller: "MainCtrl"})
    // Pages
    //.when("/denom", {templateUrl: "partials/list.html", controller: "DenomListController"})
    .when("/parajes", {templateUrl: "partials/map.html", controller: "MapCtrl"})
    .when("/zone", {templateUrl: "partials/zone.html", controller: "ZoneCtrl"})
    .when("/utm", {templateUrl: "partials/utm.html", controller: "UTMCtrl"})
    .when("/fotos", {templateUrl: "partials/fotos.html", controller: "FotosCtrl"})
    .when("/especies", {templateUrl: "partials/advancedSearch.html", controller: "AdvancedSearchCtrl"})
    .when("/specy", {templateUrl: "partials/specy.html", controller: "SpecyCtrl"})
    .when("/genus", {templateUrl: "partials/genus.html", controller: "GenusCtrl"})
    .when("/family", {templateUrl: "partials/family.html", controller: "FamilyCtrl"})
    //.when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

flora.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('components/pagination/dirPagination.tpl.html');
});


