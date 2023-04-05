// Wrap the code inside an Immediately Invoked Function Expression (IIFE)
// to avoid polluting the global namespace
(function () {
  'use strict'; // Enable strict mode to catch common JavaScript errors

  // Declare the AngularJS module named "NarrowItDownApp" with no dependencies
  angular.module('NarrowItDownApp', [])

  // Register the "NarrowItDownController" controller with the "NarrowItDownApp" module
  .controller('NarrowItDownController', NarrowItDownController)

  // Register the "MenuSearchService" service with the "NarrowItDownApp" module
  .service('MenuSearchService', MenuSearchService)

  // Register the "foundItems" directive with the "NarrowItDownApp" module
  .directive('foundItems', FoundItemsDirective);

  // Define the "NarrowItDownController" controller
  function NarrowItDownController(MenuSearchService) {
    var ctrl = this; // Assign the controller instance to the variable "ctrl"

    // Define the "search" function for the controller
    ctrl.search = function () {
      // Call the "getMatchedMenuItems" method from the "MenuSearchService"
      // and pass the "searchTerm" from the input field
      MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
        .then(function (foundItems) {
          // Assign the "foundItems" to the "found" property of the controller
          ctrl.found = foundItems;
        });
    };

    // Define the "removeItem" function for the controller
    ctrl.removeItem = function (index) {
      // Remove the item at the given "index" from the "found" array
      ctrl.found.splice(index, 1);
    };
  }

  // Define the "MenuSearchService" service
  function MenuSearchService($http) {
    var service = this; // Assign the service instance to the variable "service"

    // Define the "getMatchedMenuItems" method for the service
    service.getMatchedMenuItems = function (searchTerm) {
      // Send an HTTP GET request to the server to fetch the menu items
      return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json')
        .then(function (result) {
          // Process the result and keep only the items that match the "searchTerm"
          var foundItems = result.data.menu_items.filter(function (item) {
            return item.description.includes(searchTerm);
          });

          // Return the processed items
          return foundItems;
        });
    };
  }

  // Define the "FoundItemsDirective" directive
  function FoundItemsDirective() {
    return {
      templateUrl: 'foundItems.html', // The template URL for the directive
      scope: {
        foundItems: '<', // One-way binding for the "foundItems" attribute
        onRemove: '&' // Function reference binding for the "onRemove" attribute
      },
      controller: 'NarrowItDownController', // The controller for the directive
      controllerAs: 'ctrl', // The controller alias for the directive
      bindToController: true // Bind the isolated scope properties to the controller
    };
  }

})();
