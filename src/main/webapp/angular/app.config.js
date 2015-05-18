// TO CFG!!
//var serverUrl = "http://192.168.1.111:8080";
//var serverUrl = "http://192.168.1.16:8080";
//var serverUrl = "https://botanica-moncayo-backend.herokuapp.com";
var serverUrl = "54.88.136.216";

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
    .when("/specy", {templateUrl: "partials/specy.html", controller: "SpecyCtrl"})
    .when("/genus", {templateUrl: "partials/genus.html", controller: "GenusCtrl"})
    .when("/family", {templateUrl: "partials/family.html", controller: "FamilyCtrl"})
    .when("/zone", {templateUrl: "partials/zone.html", controller: "ZoneCtrl"})
    .when("/utm", {templateUrl: "partials/utm.html", controller: "UTMCtrl"})
    .when("/advancedSearch", {templateUrl: "partials/advancedSearch.html", controller: "AdvancedSearchCtrl"})
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

flora.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('components/pagination/dirPagination.tpl.html');
});


