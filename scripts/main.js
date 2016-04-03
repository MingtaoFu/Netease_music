var spawn = require('child_process').spawn;
var dl = require('./scripts/lib/download');
var Player = require('player');

angular.module("app", ['api'])
  .factory('myReq', function($q) {
    return function(method, url, data) {
      var curlParams = [
        '-X',
        method,
        '-H',
        "Cookie: usertrack=c+5+hlYR3C65d3/Gb7aQAg==; _ntes_nnid=524d648ceb9dbaaac50ab8a95ff08817,1444011056207; _ntes_nuid=524d648ceb9dbaaac50ab8a95ff08817; vjuids=30f66ae81.151050f8756.0.0e1fc893; __gads=ID=918781a76059546d:T=1448621752:S=ALNI_MaIh_UeoFrcqe-HwJSu8OMjnMkZQA; visited=true; NETEASE_WDA_UID=35718132#|#1410360134372; Province=027; City=027; vjlast=1447488883.1458880556.11; vinfo_n_f_l_n3=9b12aab331cb1b0a.1.28.1447488882534.1458818613447.1458880604982; _ga=GA1.2.2005696341.1447412907; JSESSIONID-WYYY=9e43c22a0c6e72435b4d91620160036d13445f5682a0e23c87a0c93cac5d7584d573fc85cec5d38aec45eea316eaa212770e5156986e3545d048ece5e9cc43997b0e30483bc736af13afffdfd7a924ea26481ec6cca0c854065f3f2cfd85941147102b4460583b04040d6d9409d18b4c07d994d329ad12cbe8db0b8975074beff5bf80b9%3A1459178322875; _iuqxldmzr_=25; __utma=94650624.2005696341.1447412907.1459166353.1459176524.8; __utmb=94650624.2.10.1459176524; __utmc=94650624; __utmz=94650624.1459166353.7.5.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; playerid=27115055",
        '-H',
        "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.108 Safari/537.36",
        '-H',
        "Content-Type: application/x-www-form-urlencoded",
        '-H',
        "Origin: http://music.163.com",
        '-H',
        "Referer: http://music.163.com/",
        '-H',
        "Accept: */*",
        '-H',
        "Accept-Encoding: gzip, deflate",
        '-H',
        "Accept-Language: zh-CN,zh;q=0.8",
        '-H',
        "Connection: keep-alive",
        '-H',
        "Cache-Control: no-cache",
        "-d",
        data,
        url,
        "--compressed"
      ];
      var d = $q.defer();
      var resultArr = [];
      var free = spawn('curl', curlParams);
      free.stdout.on('data', function (data) {
        data = data.toString();
        resultArr.push(data)
      });
      free.on('exit', function (code, signal) {
        d.resolve(JSON.parse(resultArr.join("")));
      });
      return d.promise;
    }
  })
  .factory('archive', function () {
    var len = 0;
    return function (url, name, dataFunc, doneFunc) {
      dl(url, './cache/songs/', name)
        .on('data', function (err, chunk) {
          if(err == null) {
            len += chunk.length;
            dataFunc(len);
          }
        })
        .on('done', function () {
          doneFunc();
        })
    }
  })
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
  .controller("ctrl", function($scope, myReq, archive, api) {
    $scope.defaultSearchValue = "单车";
    $scope.songsArr = [];
    $scope.listList = {
      selected: 1,
      name: [
        "搜索",
        "默认",
        "喜爱"
      ]
    };
    $scope.lyric = "";
    $scope.submit = function () {
      var param = api('searchSongs', $scope.defaultSearchValue);
      var url = "http://music.163.com/weapi/cloudsearch/get/web?csrf_token=";
      myReq('POST', url, param).then(function(data) {
        $scope.songsArr = data.result.songs;
      });
    };
    $scope.getLyric = function (id) {
      var param = api('getLyric', id);
      var url = 'http://music.163.com/weapi/song/lyric?csrf_token=';
      myReq('POST', url, param).then(function (data) {
        $scope.lyric = data.lrc.lyric.replace(/\[.+?\]/g,"");
      });
    };
    $scope.archiveProcess = 0;
    $scope.getSong = function (index) {
      var param = api('getSong', $scope.songsArr[index].id);
      var url = "http://music.163.com/weapi/song/enhance/player/url?csrf_token=";
      $scope.getLyric($scope.songsArr[index].id);
      myReq('POST', url, param).then(function (data) {
        var player = new Player('./cache/songs/' + $scope.songsArr[index].id + ".mp3");
        archive(
          data.data[0].url,
          $scope.songsArr[index].id + ".mp3",
          function (process) {
            $scope.archiveProcess = process;
            $scope.$apply();
          },
          function () {
            player.play()
          }
        );
        player.on('playend',function(item){
          // return a playend item
          console.log('src:' + item + ' play done, switching to next one ...');
        });
      })
    };
  })
  .controller('lyric', function () {
    
  })
