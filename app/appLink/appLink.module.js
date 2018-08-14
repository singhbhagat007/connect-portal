(function() {  
    'use strict';
    angular.module('AkosPCP.appLink', [
      'ui.router',
      'ui.bootstrap',
      'angularMoment',
      'ngSanitize'
      ])
    .config(routeConfig);
    routeConfig.$inject = ['$stateProvider','$urlRouterProvider','$locationProvider'];
    
    function routeConfig($stateProvider,$urlRouterProvider,$locationProvider){
      //$locationProvider.html5Mode(true).hashPrefix('!');
      $urlRouterProvider.otherwise('/');
      
      var templateUrlBase = './app/appLink/template/';
    	$stateProvider
    	.state('appLink', {
          url: '/appLink/:roomID/:type',
          templateUrl:templateUrlBase+'appLink.html',
          controller:'appLink',
          controllerAs:'vm',
          title:'AppLink'
        })
    }
})();
