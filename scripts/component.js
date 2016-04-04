/**
 * Created by mingtao on 16-4-3.
 */
angular.module('component', [])
  .directive('lyricPanel', function () {
    return {
      templateUrl: "./template/lyricPanel.html",
      link: function ($scope, $ele, $attr) {

      },
      scope: {
        lyric: '='
      }
    }
  })
  .directive('searchPanel', function () {
    return {
      templateUrl: "./template/search.html"
    }
  })
  .directive('toolBar', function () {
    return {
      templateUrl: "./template/toolBar.html"
    }
  })
