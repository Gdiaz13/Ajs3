// Wrap the entire code in an IIFE (Immediately Invoked Function Expression) to avoid polluting the global namespace
(function () {
  'use strict';

  // Declare the AngularJS module "NarrowItDownApp"
  angular.module('NarrowItDownApp', [])

  // Declare the "NarrowItDownController" controller and inject the "MenuSearchService"
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', foundItems);

  // Protect the controller and service dependencies from minification
  NarrowItDownController.$inject = ['MenuSearchService'];
  MenuSearchService.$inject = ['$http'];

  // Define the "NarrowItDownController" function
  function NarrowItDownController(MenuSearchService) {
    var ctrl = this;

    // Initialize the "found" property as an empty array
    ctrl.found = [];

    // Define the "getMatchedMenuItems" method that calls the "getMatchedMenuItems" method from the service
    ctrl.getMatchedMenuItems = function () {
      // Check if the search term is not empty
      if (ctrl.searchTerm && ctrl.searchTerm.trim() !== '') {
        MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
          .then(function (result) {
            ctrl.found = result;
          });
      } else {
        ctrl.found = [];
      }
    };

    // Define the "removeItem" method to remove an item from the "found" array by its index
    ctrl.removeItem = function (index) {
      ctrl.found.splice(index, 1);
    };
  }

  // Define the "MenuSearchService" function
  function MenuSearchService($http) {
    var service = this;

    // Define the "getMatchedMenuItems" method that retrieves the menu items and filters them by the search term
    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: 'GET',
        url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
      }).then(function (result) {
        var foundItems = [];
        var menuItems = result.data;

        for (var i = 0; i < menuItems.length; i++) {
          if (menuItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            foundItems.push(menuItems[i]);
          }
        }

        return foundItems;
      });
    };
  }

  // Define the "foundItems" directive
  function foundItems() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        onRemove: '&'
      }
    };
    return ddo;
  }
})();
