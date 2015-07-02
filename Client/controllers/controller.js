var myApp = angular.module('checklistApp', []);
myApp.controller('AppCtrl', function ($scope, $http) {

  //Initialize item 
  $scope.item = {};
  
  //Initialize socket io 
  var socket = io();
  
  var refresh = function() {
    $http.get('/itemlist').success(function(res) {
      console.log("Refreshing");
      $scope.itemlist = res;
      
      //Reset values
      $scope.item.name = "";
      $scope.item.check = false;
    })
  }
  
  console.log("Checklist app controller started")
  //Load up the page
  refresh();
  
  socket.on("refresh", function() {
    refresh();
  });
  
  $scope.checkstatus = function (item) {
    //console.log(item.checked);
    return item.checked;
  }
  
  $scope.checked = function(id,status) {
    console.log(id + "has been set to:" + status);
    //Tell server that status has been changed
    console.log("Telling the server to check: " + id);
    $http.post("/itemcheck/"+id+"/"+status).success(function(res) {
      //may be unnecessary
      refresh();
    });
  }
  
  $scope.remove = function(id) {
    console.log("Telling the server to remove: " + id);
    $http.delete("/itemlist/"+id).success(function(res) {
      //may be unnecessary
      refresh();
    });
  }
  
  $scope.addItem = function() {
    console.log($scope.item);
    $http.post('/itemlist',$scope.item).success(function (res) {
      //console.log(res);
      refresh();
    })
  }
});