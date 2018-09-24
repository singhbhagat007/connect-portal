(function() {  
    'use strict';
    angular.module('AkosPCP.doctor', [
      'ui.router',
      'ui.bootstrap',
      'angularMoment',
      'ngSanitize',
      'ngFileUpload'
      ])
    .config(routeConfig);
      
    routeConfig.$inject = ['$stateProvider','$urlRouterProvider','$locationProvider'];
    
    function routeConfig($stateProvider,$urlRouterProvider,$locationProvider){
      //$locationProvider.html5Mode(true).hashPrefix('!');
      $urlRouterProvider.otherwise('/');
      
      var templateUrlBase = './app/doctor/template/';
       var templateUrl = './app/common/template/';
    	$stateProvider
    	.state('doctor', {
          url: '/dashboard',
          templateUrl:templateUrlBase+'doctor.html',
          controller:'DoctorCtrl',
          controllerAs:'vm',
          title:'Dashboard'
        })

      .state('wcNurse', {
          url: '/wcNurse/:token',
          templateUrl:templateUrlBase+'doctor.html',
          controller:'DoctorCtrl',
          controllerAs:'vm',
          title:'Dashboard'
        })

      .state('callLog', { 
          url: '/patient/callLog',
          views:{
            '@':{
              templateUrl:templateUrlBase+'doctor.callLog.html',
              controller:'DoctorCtrl',
              controllerAs:'vm',
              title:'Call Log'      
            }  
          }
        })
      .state('charting', { 
          url: '/patient/charting/:id',
          views:{
            '@':{
              templateUrl:templateUrlBase+'doctor.charting.html',
              controller:'DoctorCtrl',
              controllerAs:'vm',
              title:'Charting'      
            }  
          }
        })
      .state('doctor.call', { 
          url: '/livecall',
          views:{
            '@':{
              templateUrl:templateUrlBase+'doctor.call.html',
              controller:'DoctorCtrl',
              controllerAs:'vm',
              title:'Doctor Live Call'      
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
        title:'Login'

        })
      .state('forgot',{
        url:'/forgot',
        templateUrl:templateUrl+'forgotPassword.html',
        controller:'passwordCtrl',
        controllerAs:'vm',
        title:'forgot password'

        })
        .state('upload_location', {
                url: '/uploadlocation',
                templateUrl: templateUrlBase + 'upload_location.html',
                controller: 'DoctorCtrl',
                controllerAs: 'vm',
                title: 'upload_location'

            })
        .state('preCallTest', {//added on 230818
                //add for precalltest
                url: '/preCallTest',
                views: {
                    '@': {
                        templateUrl: templateUrlBase + 'preCallTest.html',
                        controller: 'DoctorCtrl',
                        controllerAs: 'vm',
                        title: 'preCallTest'
                    }
                }
            })
    }
})();
