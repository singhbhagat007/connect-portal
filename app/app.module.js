(function() {
    'use strict';
    angular.module('AkosPCP', [
        'ui.router',
        'ui.bootstrap',
        'ngMaterial',
        'moment-picker',
        'ngCookies',
        'ngclipboard',
        'ngSanitize',
        'ngMask',
        //'ngRoute',
        'AkosPCP.home',
        'AkosPCP.doctor',
        'AkosPCP.room',



    ])
    .run(['$rootScope','$window','$location','$log','$cookieStore','$state',function($rootScope,$window,$location,$log,$cookieStore,$state){
      
      //if($cookieStore.get('pcpDocData')){} 
      $rootScope.docData = JSON.parse(localStorage.getItem('pcpDocData'));//$cookieStore.get('pcpDocData'); 
      

      $rootScope.$on('$locationChangeStart', function (event, toState, toParams, fromState, fromParams) {
      $window.scrollTo(0, 0);
      var authToken = localStorage.getItem('doc_token');
      function noBack() {
        window.history.forward();
      }
      if((!authToken || authToken == '') && $location.$$path == '/doctor') { 
        $rootScope.isLoggedIn = false;
        $location.path('/');
        localStorage.removeItem('pcpDocData');
        localStorage.removeItem('doc_token');
      }

      if(authToken && ($location.$$path == "/")){
        $rootScope.isLoggedIn = false;
        localStorage.removeItem('pcpDocData');
        localStorage.removeItem('doc_token');
      }
      if(authToken && ($location.$$path != "/")){ 
        $rootScope.isLoggedIn = true;
        noBack();
      } 
    });
    // $rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState){
    //   $log.log('routechangesttart');
    //   $window.scrollTo(0, 0);
    //   var authToken = localStorage.getItem('doc_token');
    //   if(!authToken || authToken == ''){
    //     $rootScope.isLoggedIn = false;
    //   }
    //   if($cookieStore.get('user')){
    //     console.log('routechangesttart user');
    //     validateCookie.authService(function(result,error){
    //       console.log('authService user',result,error);
    //       if(!result){
    //          console.log('not result');
    //         $location.path("/");
    //       }else{
    //         console.log('yes result',event,toState,toParams,fromState);
    //         if(toState.url=="/settings")
    //           $location.path('/project/settings');
    //         else
    //           $location.path(toState.url);
    //       }
    //     });   
    //   }
    //   else{
    //     console.log('routechangesttart else');
    //     $location.path("/"); 
    //   }
    // });


















        }]);
})();