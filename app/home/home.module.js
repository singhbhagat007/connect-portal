(function() {  
    'use strict';
    angular.module('AkosPCP.home', [
      'ui.router'
      ])

    .config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];
    
    function routeConfig($stateProvider){
      var templateUrl = 'app/home/template/';
    	$stateProvider
    	.state('home', {
          url: '/home',
          templateUrl:templateUrl+'home.html',
          controller:'HomeCtrl',
          controllerAs:'vm',
          title:'Home'
          
        });
    }
})();
