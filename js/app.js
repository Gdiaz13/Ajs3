// Wrap all code within an Immediately Invoked Function Expression (IIFE) to prevent global scope pollution
(function () {
  'use strict';

  // Define a new AngularJS module named "NarrowItDownApp" with no dependencies
  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective);

  // Inject dependencies to prevent minification errors
  NarrowItDownController.$inject = ['MenuSearchService'];
  // Define the controller for "NarrowItDownApp"
  function NarrowItDownController(MenuSearchService) {
    var narrowItDown = this;

    // Initialize the 'found' property as an empty array
    narrowItDown.found = [];

    // Define a function to search for menu items that match the search term
    narrowItDown.searchMenuItems = function () {
      // Check if the search term is not empty
      if (narrowItDown.searchTerm) {
        // Call the MenuSearchService to fetch matched menu items
        MenuSearchService.getMatchedMenuItems(narrowItDown.searchTerm)
        .then(function (response) {
          // Update the 'found' property with the fetched matched menu items
          narrowItDown.found = response;
        });
      } else {
        // If the search term is empty, set the 'found' property to an empty array
        narrowItDown.found = [];
      }
    };

    // Define a function to remove an item from the 'found' array based on its index
    narrowItDown.removeItem = function (index) {
      narrowItDown.found.splice(index, 1);
    };
  }

  // Inject dependencies to prevent minification errors
  MenuSearchService.$inject = ['$http'];
  // Define the service for fetching and filtering menu items
  function MenuSearchService($http) {
    var service = this;

    // Define a function that takes a search term and returns a promise with matched menu items
    service.getMatchedMenuItems = function (searchTerm) {
      // Make an HTTP GET request to fetch all menu items
      return $http({
        method: 'GET',
        url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
      })
      .then(function (result) {
        // Initialize an empty array to store matched menu items
        var foundItems = [];
        // Extract the menu items from the response
        var menuItems = result.data.menu_items;

        // Loop through all menu items
        for (var i = 0; i < menuItems.length; i++) {
          // Get the description of the current menu item
          var description = menuItems[i].description;
          // Check if the description contains the search term (case-insensitive)
          if (description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            // If the search term is found, add the menu item to the 'foundItems' array
            foundItems.push(menuItems[i]);
          }
        }

        // Return the array of matched menu items
        return foundItems;
      });
    };
  }

  // Define the 'foundItems' directive for displaying the matched menu items
  function FoundItemsDirective() {
    // Define a Directive Definition Object (DDO) to configure the directive
    var ddo = {
      templateUrl: 'foundItems.html',
      // Define a one-way binding for the 'foundItems' property and a function reference binding for the 'onRemove' property
      scope: {
        foundItems: '<',
        onRemove:
