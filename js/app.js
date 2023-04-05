// This is an Immediately Invoked Function Expression (IIFE).
// It's a good practice to wrap your code in an IIFE to avoid
// polluting the global scope.
(function () {
  'use strict';

  // Create an Angular module named 'NarrowItDownApp'
  angular.module('NarrowItDownApp', [])

  // Create a controller named 'NarrowItDownController'
  .controller('NarrowItDownController', NarrowItDownController)

  // Create a service named 'MenuSearchService'
  .service('MenuSearchService', MenuSearchService)

  // Create a directive named 'foundItems'
  .directive('foundItems', FoundItemsDirective);

  // Inject the 'MenuSearchService' dependency into the controller
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var narrowItDown = this;

    // Initialize the 'found' array to store the found menu items
    narrowItDown.found = [];

    // This function will be called when the "Narrow It Down For Me!" button is clicked
    narrowItDown.searchMenuItems = function () {
      // Call the 'getMatchedMenuItems' method from the 'MenuSearchService'
      MenuSearchService.getMatchedMenuItems(narrowItDown.searchTerm)
      .then(function (response) {
        narrowItDown.found = response;
      });
    };

    // This function will be called when the "Don't want this one!" button is clicked
    narrowItDown.removeItem = function (index) {
      narrowItDown.found.splice(index, 1);
    };
  }

  // Inject the '$http' service dependency into the 'MenuSearchService'
  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;

    // This function is responsible for fetching and filtering the menu items
    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: 'GET',
        url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
      })
      .then(function (result) {
        // Process the result and keep only items that match the 'searchTerm'
        var foundItems = [];
        var menuItems = result.data;

        for (var i = 0; i < menuItems.length; i++) {
          var description = menuItems[i].description;
          if (description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            foundItems.push(menuItems[i]);
          }
        }

        // Return the processed items
        return foundItems;
      });
    };
  }

  // The 'FoundItemsDirective' function returns the directive definition object (DDO)
  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        foundItems: '<',
        onRemove: '&'
      }
    };
    return ddo;
  }

})();
