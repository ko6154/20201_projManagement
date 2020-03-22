alert("hello I'm nlist.");

angular.module('ionicApp', ['ionic'])

.controller('MyCtrl', function($scope) {
  $scope.groups = [
  {
    "id": 1,
    "name": "Finance & Accounting",
    "iconURL": "https://ionicframework.com/img/docs/venkman.jpg",
    "childItems": [
      {
        "childName": "Record To Report",
        "grandChildren": [
          {
            "grandChildName": "Framework Assets",
            "grandChildCount": 24
          },
          {
            "grandChildName": "Solution Assets",
            "grandChildCount": 11
          }
        ]
      },
      {
        "childName": "Order to Cash",
        "grandChildren": [
          {
            "grandChildName": "Framework Assets",
            "grandChildCount": 9            
          },
          {
            "grandChildName": "Solution Assets",
            "grandChildCount": 8            
          }
        ]
      },
      {
        "childName": "Source To Pay",
        "grandChildren": [
          {
            "grandChildName": "Framework Assets",
            "grandChildCount": 8
          },
          {
            "grandChildName": "Solution Assets",
            "grandChildCount": 2
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "name": "Procurement",
    "iconURL": "https://ionicframework.com/img/docs/barrett.jpg",
    "childItems": [
      {
        "childName": "Record To Report",
        "grandChildren": [
          {
            "grandChildName": "Framework Assets",
            "grandChildCount": 24
          },
          {
            "grandChildName": "Solution Assets",
            "grandChildCount": 11
          }
        ]
      },
      {
        "childName": "Order to Cash",
        "grandChildren": [
          {
            "grandChildName": "Framework Assets",
            "grandChildCount": 9
          },
          {
            "grandChildName": "Solution Assets",
            "grandChildCount": 8
          }
        ]
      },
      {
        "childName": "Source To Pay",
        "grandChildren": [
          {
            "grandChildName": "Framework Assets",
            "grandChildCount": 8
          },
          {
            "grandChildName": "Solution Assets",
            "grandChildCount": 2
          }
        ]
      }
    ]
  }
];
  
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
    // $ionicScrollDelegate.resize();
  }

  $scope.toggleSubGroup = function(item) {
    if ($scope.isSubGroupShown(item)) {
      $scope.shownChild = null;
    } else {
      $scope.shownChild = item;
    }
    // $ionicScrollDelegate.resize();
  }

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  }

  $scope.isSubGroupShown = function(item) {
    return $scope.shownChild === item;
  }

});