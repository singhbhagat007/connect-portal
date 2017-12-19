(function() {  
    'use strict';
    angular.module('AkosPCP.room', [
      'ui.router',
      'ui.bootstrap',
      'angularMoment'
    ])
    .constant('config',{
      serverBaseUrl : 'https://seeyourdoc.akosmd.com:3001',
      opentokAPIKey : 45732912
      })
    .config(routeConfig);
    routeConfig.$inject = ['$stateProvider','$urlRouterProvider','$locationProvider'];
    
    function routeConfig($stateProvider,$urlRouterProvider,$locationProvider){
      //$locationProvider.html5Mode(true).hashPrefix('!');
      $urlRouterProvider.otherwise('/');
      var templateUrlBase = './app/room/template/';
    	$stateProvider
    	.state('room', {
          url: '/room/:id',
          templateUrl:templateUrlBase+'room.html',
          controller:'RoomCtrl',
          controllerAs:'vm',
          title:'Room'  
          
        })
      .state('room.user', {
          url: '/user',
          views:{
            '@':{
              templateUrl:templateUrlBase+'room.user.html',
              controller:'RoomCtrl',
              controllerAs:'vm',
              title:'First Time User Enter'
            }
          }
        })
      .state('room.medicalHistory', {
          url: '/medicalHistory',
          views:{
            '@':{
              templateUrl:templateUrlBase+'room.medicalHistory.html',
              controller:'RoomCtrl',
              controllerAs:'vm',
              title:'User Medical History'
            }
          }
        })
      .state('room.symptoms', {
          url: '/symptoms',
          views:{
            '@':{
              templateUrl:templateUrlBase+'room.symptoms.html',
              controller:'RoomCtrl',
              controllerAs:'vm',
              title:'User Symptoms'
            }
          }
        })
      .state('room.call', {
          url: '/livecall',
          views:{
            '@':{
              templateUrl:templateUrlBase+'room.call.html',
              controller:'RoomCtrl',
              controllerAs:'vm',
              title:'User Call'
            }
          }
        })
    }
})();
