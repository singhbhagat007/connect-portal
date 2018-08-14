(function(){
    'use strict';
    angular
        .module('AkosPCP')
        .filter('setTimerOnlineDoctorFilter',setTimerOnlineDoctorFilter);
        setTimerOnlineDoctorFilter.$inject = ['$interval'];
        function setTimerOnlineDoctorFilter($interval){
            return $interval(function(x){
                 x--;
            },1000);
            
        }
})();



