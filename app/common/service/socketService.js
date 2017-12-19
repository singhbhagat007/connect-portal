(function(){
	angular
		.module('AkosPCP')
		.factory('socketService',socketService);
		socketService.$inject = ['$rootScope','$q'];
		function socketService($rootScope,$q){
			if(io.connected == undefined){
				var socket = io.connect('https://seeyourdoc.akosmd.com:3001');
			}

			return{
				connect : function(){
					socket.io.connect('https://seeyourdoc.akosmd.com:3001');	
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