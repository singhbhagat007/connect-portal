(function() {  
    'use strict';
    angular.module('AkosPCP.doctor', [
      'ui.router',
      'ui.bootstrap',
      'angularMoment',
      'ngSanitize'
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
      
      var templateUrlBase = './app/doctor/template/';
    	$stateProvider
    	.state('doctor', {
          url: '/dashboard',
          templateUrl:templateUrlBase+'doctor.html',
          controller:'DoctorCtrl',
          controllerAs:'vm',
          title:'Doctor'
        })
      .state('doctor.call', { 
          url: '/livecall',
          views:{
            '@':{
              templateUrl:templateUrlBase+'doctor.call.html',
              controller:'DoctorCtrl',
              controllerAs:'vm',
              title:'Doctor Call'      
            }  
          }
        })
      .state('doctor.createMeeting',{
        url:'/createMeeting',
        views:{
          '@':{
            templateUrl:templateUrlBase+'doctor.createMeeting.html',
            controller:'DoctorCtrl',
            controllerAs:'vm',
            title:'Doctor Create Meeting'
          }
        }
        })
      .state('doctor.viewMeeting',{
        url:'/viewMeeting/:id',
        views:{
          '@':{
            templateUrl:templateUrlBase+'doctor.viewMeeting.html',
            controller:'DoctorCtrl',
            controllerAs:'vm',
            title:'Doctor View Meeting'    
          }
        }
        })
      .state('login',{
        url:'/',
        templateUrl:templateUrlBase+'doctor-login.html',
        controller:'DoctorCtrl',
        controllerAs:'vm',
        title:'Doctor Login Page'

        })
    }
})();
