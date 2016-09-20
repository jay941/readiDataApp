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

    // Initializing function called when sidebar initialzied via DOM
    $scope.init=function () {
      var final = [];
      // Fetch list of Data Structure starting from scanStart
      var cb = function (data, type) {
       array.push(type);
        if (array.length == 3) {
          for (var j = 0; j < array.length; j++) {
            array[j].forEach(function (n, index) {
              final.push({
                "id": n.value,
                "title": n.key
              });//end of push
            });//end of forEach
          }
          console.log('data', final)
        //binding the data to view
        $scope.data1 = final;

        }
        scanStart = data[0];
        // console.log(scanStart)
        if (data[0] != 0) redisService.scan(scanStart, cb);

      };
          
      console.log("calling doScan");
      var doScan = redisService.scan(scanStart, cb);
      // console.log('doScan ',doScan);
    };
 
    //function click Used to find selected node
    $scope.click = function (a) {
      var selected = a.$$watchers[0].last;
      console.log('test function ', selected);
      //passing selected data and retriving value from servise-redisService
      redisService.getData(selected).then(function (find) {
        $scope.items = find;
       

      })//end of getData service
    };//end of test

    //function add -To add data to redis server
    $scope.add = function () {
      smalltalk.prompt('redis', 'Enter Data u want to add in proper syntax', 'Enter Data').then(function (value) {
        var spl = value.split(/(\s+)/);

        var name = spl[0];
        var dname = spl[2];
        var dkey = spl[4];
        var dvalue = spl[6];

        console.log(name, dname, dkey, dvalue);
        redisService.addData(name, dname, dkey, dvalue).then(function (su) {
          alert(su);

          location.reload();
        })
      }); //end of prompt

    }//end of add

    //function remove -To remove data to redis server
    $scope.remove = function () {
      smalltalk.prompt('redis', 'Remove Data u want to add in proper syntax', 'Remove Data').then(function (value) {
        var spl = value.split(/(\s+)/);
        var name = spl[0];
        var dname = spl[2];
        var dkey = spl[4];
        console.log(name, dname, dkey);
        redisService.removeData(name, dname, dkey).then(function (su) {
          alert(su);
          location.reload();
        })

      });//end of prompt

    }//end of remove
    $scope.load = function () {
     
    }

  })//end of controller



