(function() {  
    'use strict';
    angular.module('AkosPCP.room', [
      'ui.router',
      'ui.bootstrap',
      'angularMoment'
    ])
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
          title:'Tell Us About Yourself'  
        })
      .state('roomNurse', {
          url: '/room/:id',
          templateUrl:templateUrlBase+'room.nurse.html',
          controller:'RoomCtrl',
          controllerAs:'vm',
          title:'Tell Us About Yourself'  
        })
      


      .state('inviteRoom', {
          url: '/room/:id?inviteId',
          templateUrl:templateUrlBase+'room.otherUser.html',
          controller:'RoomCtrl',
          controllerAs:'vm',
          title:'Tell Us About Yourself'  
          
        })

      .state('AkosLive', {
          url: '/room/:id?patientId?transactionId',
          templateUrl:templateUrlBase+'room.client.html',
          controller:'RoomCtrl',
          controllerAs:'vm',
          title:'Tell Us About Yourself'  
          
        })

      .state('verify', {
          url: '/room/verify',
          templateUrl:templateUrlBase+'room.verify.html',
          controller:'RoomCtrl',
          controllerAs:'vm',
          title:'Verification'  
          
        })

      .state('room.user', {
          url: '/user',
          views:{
            '@':{
              templateUrl:templateUrlBase+'room.user.html',
              controller:'RoomCtrl',
              controllerAs:'vm',
              title:'Personal Info'
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
              title:'Medical History'
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
              title:'Symptoms'
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
              title:'Patient Live Call'
            }
          }
        })
      .state('room.callend', {
          url: '/callend',
          views:{
            '@':{
              templateUrl:templateUrlBase+'room.callend.html',
              controller:'RoomCtrl',
              controllerAs:'vm',
              title:'Patient Live Call end'
            }
          }
        })
      .state('insurancedetails',{
          url: '/room/cityHealth/insurancedetails',
          templateUrl:templateUrlBase+'room.insurancedetails.html',
          controller:'RoomCtrl',
          controllerAs:'vm',
          title:'Insurance Details'
      })
      .state('billingdetails',{
          url: '/room/cityHealth/billingdetails',
          templateUrl:templateUrlBase+'room.billingdetails.html',
          controller:'RoomCtrl',
          controllerAs:'vm',
          title:'Billing Details'
      })
      .state('livecallIn',{
          url: '/room/cityHealth/livecall',
          templateUrl:templateUrlBase+'room.call.html',
          controller:'RoomCtrl',
          controllerAs:'vm',
          title:'Patient Live Call'
      })
    }
})();
