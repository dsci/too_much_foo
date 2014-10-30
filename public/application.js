var myApp = angular.module("myApp", []);

var responseDataExtractor = function(){
  this.extract = function(url, responseData){
    // We assume that the latest part of the url 
    // might be an id (\d+)
    // If not, it is the resource name, otherwise the
    // resource name is the part before \d+
    var urlParts = url.split(/\//);
    console.log(urlParts);
    var lastPart = urlParts[urlParts.length-1];
    var resourceName = lastPart;
    if(lastPart.match(/\d+/)){
      resourceName = urlParts[urlParts.length-2];
    } 
    var pluralizedResource = inflect.pluralize(resourceName);
    var singularizedResource = inflect.singularize(resourceName);
    var extractedData = {};
    var dataKey = Object.keys(responseData.data)[0];
    if(dataKey.match(pluralizedResource)){
      extractedData = responseData.data[pluralizedResource];
    }else{
      extractedData = responseData.data[singularizedResource];
    }
    return extractedData;
  }
}

var restService = function($http, responseDataExtractor){
  this.getResource = function(url, callback){
    
    var cb = function(data){
      callback(responseDataExtractor.extract(url, data));
    }
    $http.get(url).then(cb);
  }
}

var mainController = function($scope, restService){
  $scope.name = "Hallo";
  $scope.getResource = function(){
    restService.getResource("/posts", function(result){
      $scope.fetchedPostList = true;
      $scope.posts = result;
    });
  }
  $scope.showPost = function(id){
    restService.getResource("/posts/"+id, function(result){
      $scope.post = result;
    });
  }
};

myApp.service("responseDataExtractor", responseDataExtractor);

mainController.$inject = ["$scope", "restService"];
restService.$inject = ["$http", "responseDataExtractor"];
myApp.controller("mainCtrl", mainController);
myApp.service('restService', restService);


