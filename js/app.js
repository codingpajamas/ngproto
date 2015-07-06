'use strict';

angular.module('contactApp', ['ngRoute', 'ngResource'])
	.config(function($routeProvider){
		$routeProvider
			.when('/', {
				controller: 'listCtrl',
				templateUrl: '../partials/list.html'
			})
			.when('/add', {
				controller: 'addCtrl',
				templateUrl: '../partials/add.html'
			})
			.when('/:contactid', {
				controller: 'detailCtrl',
				templateUrl: '../partials/detail.html'
			}) 
			.when('/:contactid/edit', {
				controller: 'editCtrl',
				templateUrl: '../partials/edit.html'
			}) 
			.otherwise({
				redirectTo: '/'
			});
	})
	.factory('ContactData', ['$resource', function($resource){
		return $resource('http://localhost:3000/contacts/:contactid');
	}])
	.controller('listCtrl', function($scope, ContactData){
		$scope.contacts = [];

		ContactData.query(function(data){
			$scope.contacts = data;
		}); 

		$scope.deleteContact = function(intContactId, intIndex){ 
			ContactData.delete({contactid:intContactId}, function(response){
				if (response.$resolved) {
					$scope.contacts.splice( intIndex, 1 );
				}
			});
		} 
	})
	.controller('detailCtrl', function($scope, ContactData, $routeParams){  
		$scope.contact = []
		ContactData.get({contactid: $routeParams.contactid}, function(data){
			$scope.contact = data; 
		}); 
	})
	.controller('addCtrl', function($scope, ContactData, $location){
		$scope.addContact = function(){
			ContactData.save({name:$scope.contactName, number:$scope.contactNumber}, function(response){
				if (response.$resolved) {
					$location.path('/').replace();
				}
			});
		}
	})
	.controller('editCtrl', function($scope, ContactData, $routeParams, $location){
		$scope.contact = [];

		var objContact = ContactData.get({contactid: $routeParams.contactid}, function(response){
			if(response.$resolved) {
				$scope.contact = response;
			}
		});

		$scope.editContact = function() {
			objContact.name = $scope.contact.name;
			objContact.number = $scope.contact.number;
			objContact.$save(function(response){
				if (response.$resolved) {
					$location.path('/').replace();
				}
			});
		}
	})