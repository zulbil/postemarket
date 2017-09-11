(function(){

	var app = angular.module('ecommerce',[
			'ui.bootstrap',
			'angularUtils.directives.dirPagination',
			'jcs-autoValidate',
			'angular-filepicker', 
			'oitozero.ngSweetAlert', 
			'toaster', 
			'ngAnimate'
		]);  

	// app.run([
	// 		'defaultErrorMessageResolver',
 //    	function (defaultErrorMessageResolver) {
 //        // To change the root resource file path
 //            defaultErrorMessageResolver.setI18nFileRootPath('./libs/jcs-autoValidate_fr-fr.json');
 //        	defaultErrorMessageResolver.setCulture('fr-FR');
 //   		 }
	// ]);

	app.config(function (filepickerProvider){
		filepickerProvider.setKey('AkEt7nZE0SdoAu2iK57nlz'); 
	});

	app.controller('DashboardController', ['$scope','$http', function ($scope, $http){
		console.log('Welcome to the DashboardController'); 
		$scope.me = window.SAILS_LOCAL.me;  

		$scope.getTotalProducts = function (){
			$http.get('/user/'+$scope.me.id)
			 .then( function onSuccessCallback (data){
			 	 var products = data; 

			  }, function onErrorCallback (err) { console.log(err);})
		}
	}]); 

	app.controller('NavBarController', ['$scope', function ($scope){
		console.log("Welcome to the NavBarController"); 
   
		$scope.me = window.SAILS_LOCAL.me; 
		console.log($scope.me); 
		$scope.showAdmin = null; 
		if($scope.me.role == 'admin'){
			$scope.showAdmin = true; 
		}

	}]); 

	app.controller('SideBarController', ['$scope', function ($scope){
		console.log("Welcome to the SideBarController"); 
   
		$scope.me = window.SAILS_LOCAL.me; 
		console.log($scope.me); 
		$scope.showAdminPortal = null; 
		if($scope.me.role == 'admin'){
			$scope.showAdminPortal = true; 
		}

	}]); 

	//User Profile Controller
   app.controller('userProfileController', ['$scope','$http','toaster','filepickerService', function ($scope, $http, toaster, filepickerService){
		
		console.log('Welcome to the userProfileController'); 
		$scope.me = window.SAILS_LOCAL.me; 
		console.log($scope.me);
		$scope.isEmpty = false; 
		$scope.text = "No description yet"; 
		$scope.userFound = window.SAILS_LOCAL.userFound; 
		$scope.checkIfEmpty = function (variable){
			if(variable == ''){
				$scope.isEmpty = true;
			}
			else 
				$scope.isEmpty = false; 

			return $scope.isEmpty;
		}
		$scope.countries = []; 

		$scope.getCountries = function(){
			$http({
				method: 'GET', url: 'https://restcountries.eu/rest/v2/'
			}).then(function onSuccessCallback(response){
				console.log(response.data);
				$scope.countries = response.data; 
			}, function onErrorCallback(err){ console.log(err);})
		}

		$scope.upload = function (){
					filepickerService.pick(
		            {
		                mimetype: 'image/*',
		                language: 'fr',
		                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
		                openTo: 'IMAGE_SEARCH'
		            },
		            function(Blob){
		                console.log(JSON.stringify(Blob));
		                $scope.me.profilePicture = Blob.url;
		            }
		        )
					return $scope.me.profilePicture;
		};

		$scope.saveChanges = function (){
			 	console.log($scope.me.profilePicture); 
			 	$http({
			 			method: 'PUT', url: '/updateProfilePicture/'+$scope.me.id, 
			 			data: $scope.me, 
			 			headers: {'Content-Type': 'x-www-form-urlencoded'}
			 		})
			 	     .then(function onSuccessCallback(data){
			 	     	console.log(data);
			 	     	$scope.me.profilePicture = data; 
			 	     	toaster.pop({ type: 'success', title: 'Success', body: 'Successfully updated', showCloseButton: true });

			 	     }, 
			 	      function onErrorCallback(err){
			 	     	toaster.pop({ type: 'error', title: 'Error',body: 'Unable to retrieve data',showCloseButton: true});
			 	      }); 
			 }

			 $scope.updatedUserInfo = function (){
			 	$http({
			 		method: 'PUT', url: '/updateProfile/'+$scope.me.id, data: $scope.me, 
			 		headers: {'Content-Type': 'x-www-form-urlencoded'}
			 	}).then( function onSuccessCallback (){
			 		toaster.pop({ type: 'success', title: 'Success',body: 'Successfully updated', showCloseButton: true});
			 	}, function onErrorCallback (err){
			 		toaster.pop({ type: 'error', title: 'Bug',body: 'Something wrong, sorry, Try again',showCloseButton: true});
			 		console.log(err); 
			 	});
			 }

			 $scope.changePassword = function (){
			 	$http({ method: 'PUT',  url: '/user/changePassword/'+$scope.me.id, 
			 		data: {newPassword: $scope.newPassword}, 
			 		headers: {'Content-Type': 'x-www-form-urlencoded'}
			 	}).then( function onSuccessCallback (){
			 		toaster.pop({ type: 'success', title: 'Success', body: 'Successfully updated',showCloseButton: true});
			 	}, function onErrorCallback(err){
			 		toaster.pop({ type: 'error',title: 'Bug',body: 'Something wrong, sorry, Try again',showCloseButton: true});
			 		console.log(err); 
			 	});
			 }

	}]); 


	//User Admin Controller
	app.controller('AdminController', ['$scope','$http','toaster','SweetAlert', function ($scope, $http, toaster, SweetAlert){
		console.log('Welcome to the AdminController'); 
		$scope.user = {}; 
		$scope.users = []; 
		$scope.showForm = false; 
		$scope.pageSize = 5; 
		$scope.currentPage = 1; 
		$scope.numberOfUser = 0;
		$scope.orders = []; 
		$scope.numberOfOrder = 0;
		$scope.somme = 0; 
		
		$scope.userFound = window.SAILS_LOCAL.userFound; 

		$scope.sort = function (keyname){
			$scope.sortKey = keyname; 
			$scope.reverse = !$scope.reverse; 
		}

			$http.get('/getAllUsers')
				 .then( function onSuccessCallback(response){
				 	$scope.users = response.data; 
				 	console.log($scope.users); 
				 	$scope.numberOfUser = $scope.users.length;
				 }, 
				  function onErrorCallback(error){
				  	toaster.pop({
						                type: 'error',
						                title: 'Error',
						                body: 'Unable to retrieve data',
						                showCloseButton: true
						            });
				  });
			
			$http.get('/orders/all')
				 .then( function onSuccessCallback(response){
				 	$scope.orders = response.data; 
				 	console.log($scope.orders); 
				 	$scope.numberOfOrder = $scope.orders.length;
				 	for(var i=0; i<$scope.numberOfOrder; i++){
				 		$scope.somme +=$scope.orders[i].cart.totalPrice; 
				 	}
				 }, 
				  function onErrorCallback(error){
				  	toaster.pop({
						                type: 'error',
						                title: 'Error',
						                body: 'Unable to retrieve data',
						                showCloseButton: true
						            });
				  });

		
		$scope.signup= function (){
		
			var newUser = {
				fullname : $scope.user.fullname, 
				email: $scope.user.email, 
				username: $scope.user.username, 
				password: $scope.user.password
			 }; 
			
			$http({
						method: 'POST', 
						url: '/signup', 
						data: newUser
				})
				.then( function onSuccessCallback (data){
					 		console.log(data); 
						 		alert("Success Insertion");
					}, function onErrorCallback (error){
						 		console.log(error); 
						 		toaster.pop({
						                type: 'error',
						                title: 'Error',
						                body: error.data,
						                showCloseButton: true
						            });
						 	
				}); 

		}


		$scope.login = function (){
			var credentials = {
				email: $scope.user.email, 
				username: $scope.user.username, 
				password: $scope.user.password
			}
			$http.put('/login', credentials)
				 .then(function onSuccessCallback (data){
				  		toaster.pop({type: 'success', title: 'Success',body: "Successfully log in",showCloseButton: true});
				  		console.log(data);
				  	 window.location.href= "/admin/adminPortal"; 

				  }, function onErrorCallback (error){
				  		console.log(error); 
				  		toaster.pop({type: 'error', title: 'Error',body: error.data, showCloseButton: true});
				  })
		}

		$scope.banned = function (user){
			console.log(user); 
			$http({
				method: 'PUT', 
				url: '/updateBanned/'+user.id, 
				data: user, 
				headers: {
					'Content-Type':'x-www-form-urlencoded'
				}
			}).then(function onSuccessCallback(data){
				toaster.pop({
					type: 'success', title: 'Success', 
					body: 'The Banned state of '+user.fullname+ ' was successfully updated'
				});
				console.log(data); 
			}, function onErrorCallback (err){
				toaster.pop({
					type: 'error', title: 'Bug', body: 'Seems like something going wrong'
				});
				console.log(err); 
			})
		}

		$scope.deleted = function (user){
			console.log(user); 
			$http({
				method: 'PUT', 
				url: '/updateDeleted/'+user.id, 
				data: user, 
				headers: {
					'Content-Type':'x-www-form-urlencoded'
				}
			}).then(function onSuccessCallback(data){
				toaster.pop({
					type: 'success', title: 'Success', 
					body: 'The Deleted state of '+user.fullname+ ' was successfully updated'
				});
				console.log(data); 
			}, function onErrorCallback (err){
				toaster.pop({
					type: 'error', title: 'Bug', body: 'Seems like something going wrong'
				});
				console.log(err); 
			})
		}

	}]); 

	
	//User Controller
	app.controller('UserController', ['$scope','$http','SweetAlert','toaster', function ($scope, $http, SweetAlert, toaster){
		console.log('Welcome to the UserController'); 

		$scope.user = {}; 
		$scope.passwordRecoveryToken = window.SAILS_LOCALS.passwordRecoveryToken; 
		console.log($scope.passwordRecoveryToken); 
		$scope.signup= function (){
		
			var newUser = {
				fullname : $scope.user.fullname, 
				email: $scope.user.email, 
				username: $scope.user.username, 
				password: $scope.user.password
			 }; 
			
			$http({
						method: 'POST', 
						url: '/signup', 
						data: newUser
				})
				.then( function onSuccessCallback (data){
					 		console.log(data); 
						 		alert("Success Insertion");
					}, function onErrorCallback (error){
						 		console.log(error); 
						 		toaster.pop({
						                type: 'error',
						                title: 'Error',
						                body: error.data,
						                showCloseButton: true
						            });
						 	
				}); 

		}

		$scope.forgetPassword = function () {
			$http({
				method: 'PUT', 
				url: '/user/generate-recovery-email', 
				data: $scope.user,
				headers: {
					'Content-Type':'x-www-form-urlencoded'
				}
			}).then( function onSuccessCallback (data) {
				console.log("Success: "+data);
				toaster.pop({type: 'success', title: 'Email Sent!', body: 'An email was sent to your email, use that link to reset your password', showCloseButton: true}); 
			}, function errorCallback (error) {
				toaster.pop({type: 'error',title: 'Error',body: error.data,showCloseButton: true});
			})
		}

		$scope.resetPassword = function () {
			$http({
				method: 'PUT', 
				url: '/user/reset-password', 
				data: {
					passwordRecoveryToken: $scope.passwordRecoveryToken,
					password: $scope.user.password
				},
				headers: {
					'Content-Type':'x-www-form-urlencoded'
				}
			}).then( function onSuccessCallback (data) {
				console.log("Success: "+data);
				toaster.pop({type: 'info', title: 'Password reset successfully!', body: 'Your password is successfully reset', showCloseButton: true}); 
				window.location.href="/products"; 
			}, function errorCallback (error) {
				toaster.pop({type: 'error',title: 'Error',body: error,showCloseButton: true});
			})
		}


		$scope.login = function (){
			var credentials = {
				email: $scope.user.email, 
				username: $scope.user.username, 
				password: $scope.user.password
			}
			$http.put('/login', credentials)
				 .then(function onSuccessCallback (data){
				  		toaster.pop({
						                type: 'success',
						                title: 'Success',
						                body: "Successfully log in",
						                showCloseButton: true
						            });
				  		console.log(data);
				  	 window.location.href= "/products"; 

				  }, function onErrorCallback (error){
				  		console.log(error); 
				  		toaster.pop({
						                type: 'error',
						                title: 'Error',
						                body: error.data,
						                showCloseButton: true
						            });
				  })
		}
	}]); 
 	
	//Product Controller
	app.controller('ProductController', ['$scope','$http','filepickerService', 'SweetAlert',function ($scope, $http, filepickerService, SweetAlert){
		console.log('Welcome to the ProductController'); 
		$scope.products = []; 
		$scope.categories = [];
		$scope.showForm = false; 
		$scope.pageSize = 5; 
		$scope.currentPage = 1; 
		$scope.showEditForm = false; 
		$scope.product = {};
		//$scope.currentProduct = {};
		$scope.me = window.SAILS_LOCAL.me;
		$scope.totalProduct = $scope.me.products.length || 0;   
		$scope.totalComment = 0; 
		$scope.text = "Hello"; 
		$scope.oneDevis = window.SAILS_LOCAL.oneDevis; 
		$scope.devis = window.SAILS_LOCAL.devis; 
		console.log($scope.oneDevis); 

		$scope.sort = function (keyname){
			$scope.sortKey = keyname; 
			$scope.reverse = !$scope.reverse; 
		}

		$scope.alertSuccess = function (){
			SweetAlert.swal("Good job!", "Product was successfully added", "success");
		}

		$scope.getAllProducts = function(){
			io.socket.get('/user/'+$scope.me.id, function whenServerResponds (data, JWR){
				if(JWR.statusCode >=400){
					console.log("Something wrong"); 
					return; 
				}
				$scope.products = data.products; 
				$scope.totalComment = data.comments; 
				$scope.totalProduct = $scope.products.length; 
				console.log("total product: "+$scope.totalProduct); 
				console.log("total comment: "+$scope.totalComment)
				$scope.$apply(); 

			//Listen for event applied in product object
			io.socket.on('product', function whenActionOccurs (event){
				if(event){
					SweetAlert.swal("Info", "Something is going on", "info");
				}
				$scope.products.unshift({
					name: event.data.products.name, 
					category: event.data.products.category, 
					price: event.data.products.price, 
					picture: event.data.products.picture, 
					morePictures: event.data.products.morePictures, 
					quantity: event.data.products.quantity,  
					status: event.data.products.status, 
					createdAt: event.data.products.createdAt, 
					description: event.data.products.description, 
					owner: event.data.products.owner
				});
				$scope.apply(); 
			});
			
		});
	};
		

		$scope.openForm = function (){
			$scope.showForm = true;

			return $scope.showForm;  
		}; 


		$scope.upload = function (){
			filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'fr',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function (Blob){
                console.log(JSON.stringify(Blob));
                $scope.product.picture = Blob.url;
            }
        )
	 };

	 $scope.uploadAnother = function (){
			filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'fr',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob){
                console.log(JSON.stringify(Blob));
                $scope.currentProduct.picture = Blob.url;
            }
        )
	 };

	 // $scope.uploadMultiple = function(){
  //       filepickerService.pickMultiple(
  //           {
  //               mimetype: 'image/*',
  //               language: 'fr',
  //               maxFiles: 4, //pickMultiple has one more option
  //               services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
  //               openTo: 'IMAGE_SEARCH'
  //           },
  //     function(Blob){
  //               console.log(JSON.stringify(Blob));
  //               $scope.currentProduct.morePictures = Blob.url;
  //           }
  //       );
  //   };

		$scope.addProduct = function (){ 
			$scope.product.description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nec sollicitudin mi. Maecenas maximus tellus eu rhoncus cursus. Donec feugiat est vel nulla molestie, id maximus ligula bibendum. Donec tempus consequat turpis non luctus. Integer ac ex suscipit, tempor eros ut, tempor erat. Etiam ut augue a velit rhoncus volutpat. Vivamus vel lorem non turpis auctor elementum. Fusce bibendum luctus leo, tempus bibendum metus mattis id. Vivamus sit amet leo ut justo aliquet tempus. Vestibulum vestibulum consequat mauris nec fringilla. Aenean pretium, velit vel vestibulum sollicitudin, dolor tortor tincidunt ligula, sed euismod risus turpis posuere augue. Etiam luctus mauris tortor, a porttitor arcu tincidunt at. In molestie ornare lectus tempor ornare. Nulla consequat dui nec sapien posuere, non laoreet diam fermentum.";
			var newProduct = {
				name: $scope.product.name, 
				category: $scope.product.category, 
				price: $scope.product.price, 
				picture: $scope.product.picture, 
				morePictures: [], 
				quantity: 50,  
				status: "Pending", 
				createdAt: Date.now(), 
				description: $scope.product.description
			}; 
			
			io.socket.post('/product/create', newProduct, function whenServerResponds(data, JWR){
				if (JWR.statusCode >= 400){
					console.log("Something went wrong"); 
					return; 
				}
				$scope.products.unshift(newProduct); 

				$scope.product = {}; 
				$scope.$apply();
			});
			$scope.close(); 
			$scope.alertSuccess(); 
		}

		$scope.editProduct = function (product){
			$scope.showEditForm = true; 
			$scope.currentProduct = product; 
			
		}

		$scope.updateProduct = function (){
			$http.put('/product/update/'+$scope.currentProduct.id, $scope.currentProduct)
			     .then(function onSuccessCallback (){
					SweetAlert.swal("Good job!", "Product was successfully updated", "success");    	
			     },function errorCallback (error){
			     	console.log(error); 
			     });
			
			$scope.currentProduct = {};
			$scope.showEditForm = false; 
		}

		$scope.remove = function (product){
			var index = $scope.products.indexOf(product); 
			$http.delete('product/destroy/'+product.id)
			     .then( function onSuccessCallback(){
			     	$scope.products.splice(index, 1); 
			     }, 
			     function errorCallback(error){
			     	console.log(error);
			     });	
			
		}

		$scope.removeProduct = function(product){
        	SweetAlert.swal({
            title: "Are you sure?", //Bold text
            text: "Your will not be able to recover this file!", //light text
            type: "warning", //type -- adds appropiriate icon
            showCancelButton: true, // displays cancel btton
            confirmButtonColor: "#DD6B55",
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
            closeOnCancel: false
       	 }, 
	        function(isConfirm){ //Function that triggers on user action.
	            if(isConfirm){
	            	$scope.remove(product); 
	                SweetAlert.swal("Deleted!", "Your file has been deleted.", "success");
	            } else {
	                SweetAlert.swal("Cancelled", "Your file is safe :)", "error");
	            }
	        });
        }

		$scope.close = function (){
			$scope.showForm = false; 
			$scope.showEditForm = false; 
		}

		$scope.getAllCategories = function (){
			io.socket.get('/categories', function whenServerResponds (data, JWR){
				if(JWR.statusCode >=400){
					console.log("Something wrong"); 
					return; 
				}
				$scope.categories = data; 

				$scope.$apply(); 

			//Listen for event applied in product object
			io.socket.on('category', function whenActionOccurs (event){
				if(event){
					SweetAlert.swal("Info", "Something is going on", "info");
				}
				$scope.categories.unshift({
					name: event.data.name, 
					parent: event.data.parent, 
					ancestors: event.data.ancestors
				});
				$scope.apply(); 
			});
		})
	}

	}]); 
	

})();