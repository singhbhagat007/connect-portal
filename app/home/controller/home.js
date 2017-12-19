(function() { 
    'use strict';
	angular
        .module('AkosPCP.home')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope','$http','$rootScope','$location','$window','$log','opentokSessionService'];

    function HomeCtrl($scope,$http,$rootScope,$location,$window,$log,opentokSessionService) {
    	var vm = this;
    	vm.title = "Home";
        $scope.apikey = "45732912";
        opentokSessionService.getOpentokSession()
        .then(function(data){
        $log.log(data);
        $scope.sessionid = data.data[0].sessionid;
        $scope.token =data.data[0].token;
        var token = $scope.token;
        var streamSelected;
        var session = OT.initSession($scope.apikey, $scope.sessionid);
        var subscriber;
        
        session.on('streamCreated', function(event) {
            var streamId = event.stream.streamId;
            var id = Math.floor( Math.random()*999 ) + 100;
            $('#subscriber').append("<div class='subscriberClass' id='subscriber"+id+"'> </div>");
            session.subscribe(event.stream, 'subscriber'+id);
            if($('.subscriberClass').length == 1){
                $('.subscriberClass').css({"width": "100%", "height": "100%","overflow":"hidden","border":"1px solid #dcdcdc","position":"absolute","left":"0","top":"0","z-index":"10"});
            }
            if($('.subscriberClass').length > 1){
                $("#subscriber"+id).addClass('newSubscriber');
            }
        }); 

        session.connect(token, function(error) {
            if (!error) {
                var publisherProperties = {name:"doctorPublisher"};
                var publisher = OT.initPublisher('doctorPublisher',publisherProperties, {
                    resolution: '320x240', 
                    frameRate: 1
                });
                session.publish(publisher);  
            }else{
                $log.log('There was an error connecting to the session: ', error.code, error.message);
            }
        });
        });
        $scope.disconnectSession = function(){
            var apiKey = $scope.apikey; 
            var sessionID =$scope.sessionid; 
            var session = OT.initSession(apiKey, sessionID);        
            session.disconnect();
        }
    }
})();