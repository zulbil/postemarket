
app.controller('UserController', ['$scope','$http', function ($scope, $http){
		console.log('Welcome to the UserController'); 
		$scope.user = {}; 

		$scope.signup= function (){
		
			var newUser = {
				fullname : $scope.user.fullname, 
				email: $scope.user.email, 
				username: $scope.user.username, 
				password: $scope.user.password
			 }; 
			
			$http({
						method: 'POST', 
						url: '/user/create', 
						data: newUser
				})
				.then( function onSuccessCallback (data){
					 		console.log(data); 
						 		alert("Success Insertion");
					}, function onErrorCallback (error){
						 		console.log(error); 
						 		alert("Insertion failed!!"); 
				}); 

		}
	}]); 