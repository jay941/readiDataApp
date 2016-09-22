/**
 * Main controller
 * //  Build our app module, with a dependency on the angular modal service.
 */
angular.module('myApp', ['ui.tree'])
  .controller('homeCtrl', function ($scope, redisService, $q) {
    var data1 = null;
    var array = [];
    var c = true;
    var scanStart = 0;
    var i = 0;
    // Initializing function called when sidebar initialzied via DOM
    $scope.init = function () {

      // Fetch list of Data Structure starting from scanStart
      var cb = function (data, type) {
        var final = [];
        array.push(type);
        i++;
        if (array.length == i) {
          for (var j = 0; j < array.length; j++) {
            array[j].forEach(function (n, index) {
              final.push({
                "id": n.value,
                "title": n.key
              });//end of push
            });//end of forEach
          }

        }
        scanStart = data[0];
        // console.log(scanStart)
        if (data[0] != 0) redisService.scan(scanStart, cb);
        console.log('data', final)
        //binding the data to view
        $scope.data1 = final;
        $scope.dataLoaded = false;
      };

      console.log("calling doScan");
      var doScan = redisService.scan(scanStart, cb);
      // console.log('doScan ',doScan);
    };

    //function click Used to find selected node
    $scope.click = function (a) {
      var selected = a.$$watchers[0].last;
      //passing selected data and retriving value from servise-redisService
      redisService.getData(selected).then(function (find) {
        console.log(find)
        $scope.items = find;


      })//end of getData service
    };//end of test
    //function add -To add data to redis server
    $scope.add = function () {
      smalltalk.prompt('RedisData', 'Enter Data You Want To Add (Ex:-DataType  key  data )', 'Enter Data').then(function (value) {
        var spl = value.split(/(\s+)/);

        var name = spl[0];
        var dname = spl[2];
        var dkey = spl[4];
        var dvalue = spl[6];

        console.log(name, dname, dkey, dvalue);
        redisService.addData(name, dname, dkey, dvalue).then(function (su) {
          smalltalk.alert('Done', su).then(function () {
            location.reload();
          });


        })
      }); //end of prompt

    }//end of add

    //function remove -To remove data to redis server
    $scope.remove = function () {
      smalltalk.prompt('RedisData', 'Remove Data You Want To Remove (Ex:-DataType  key  data )', 'Remove Data').then(function (value) {
        var spl = value.split(/(\s+)/);
        var name = spl[0];
        var dname = spl[2];
        var dkey = spl[4];
        console.log(name, dname, dkey);
        redisService.removeData(name, dname, dkey).then(function (su) {
          smalltalk.alert('Done', su).then(function () {
            location.reload();
          });
        })

      });//end of prompt

    }//end of remove
    $scope.load = function () {
      $scope.dataLoaded = true;
      setTimeout(function () {
        smalltalk.alert('Done', 'Data Loaded Successfully').then(function () {
          $scope.dataLoaded = false;

        });
      }, 300);

    }

    var today = new Date();
    document.getElementById('dtText').innerHTML = today.toDateString();
  })//end of controller



