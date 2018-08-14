(function(){
	angular
		.module('AkosPCP')
		.factory('socketService',socketService);
		socketService.$inject = ['$rootScope','$q','config'];
		function socketService($rootScope,$q,config){
			if(io.connected == undefined){
				var socket = io.connect(config.socketBaseUrl);//'wss://akosmd.com:3001'
			}

			return{
				removeAllListeners: function (eventName, callback) {
			      socket.removeAllListeners();
			    },
				connect : function(){
					socket.io.connect(config.socketBaseUrl);	
					console.log("socket is up");
				},
				on : function(eventName, callback){
					socket.on(eventName, function(data){
						$rootScope.$apply(function(){
							callback(data);
							})
						});
				},
				emit : function(eventName, data, callback){
					socket.emit(eventName,data,function(data){
						$rootScope.$apply(function(){
							callback(data);
							})
						})
					
					
					
				}

			}
		}
	})();