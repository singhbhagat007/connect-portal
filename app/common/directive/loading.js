/**
 * Created by root on 15/4/16.
 */
(function () {
  'use strict';

  var loading = function(){
    return {
      restrict: 'E',
      replace:true,
      scope: true,
      template: '<div class="loading"><img src="./assets/images/ajax-loader.gif"/></div>',
      link: function (scope, element, attr) {
        scope.$watch('loading', function (val) {
          if (val)
            // $timeout(function(){
                $(element).show();
            // },3000);
          else
            $(element).hide();
        });
      }
    }
  };
  angular.module('AkosPCP').directive('loading',loading);
})();
