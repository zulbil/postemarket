(function (){
	var frontApp = angular.module('postecommerce', [
			'toaster',
			'ui.bootstrap',
			'oitozero.ngSweetAlert',
			'ngAnimate',
			'angularUtils.directives.dirPagination',
			'angularPayments',
			'stripe'
		]);

	 frontApp.config(function (){
	 	Stripe.setPublishableKey('pk_test_rjKZ7kOzNWJkITKlRRQLNuIp');
	 });

	frontApp.controller('AppController', ['$scope', '$http', function ($scope, $http){
			$scope.text = "Hello World";
	}]);

	frontApp.controller('NavBarController', ['$scope','$http', function ($scope, $http){
		console.log("Welcome to the NavBarController");

		$scope.me = window.SAILS_LOCAL.me;
		$scope.cart = window.SAILS_LOCAL.cart || {};
		console.log("size :"+$scope.cart);
		console.log($scope.me);

		$scope.showLogin = null;
		if($scope.me == undefined){
			$scope.showLogin = true;
		}

		$scope.checkIfEmpty = function (){
			if($scope.cart){
				$scope.isEmpty = false;
			}
			else {
				$scope.isEmpty = true;
			}
			console.log("Le panier est vide? :"+$scope.isEmpty);
			return $scope.isEmpty;
		}

		$scope.getAllCategories = function (){
			io.socket.get('/categories', function whenServerResponds (data, JWR){
				if(JWR.statusCode >=400){
					console.log("Something wrong");
					return;
				}
				$scope.categories = data;
				console.log($scope.categories);
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

	frontApp.controller('ProductController', ['$scope', '$http', 'toaster','SweetAlert', function ($scope, $http, toaster,SweetAlert){
			$scope.products = window.SAILS_LOCAL.allProducts;
			$scope.me = window.SAILS_LOCAL.me || {};
			$scope.product = window.SAILS_LOCAL.product || {};
			$scope.orders = window.SAILS_LOCAL.orders || {};
			$scope.showPopup = false;
			$scope.cart = window.SAILS_LOCAL.cart;
			$scope.productCategory = window.SAILS_LOCAL.productPerCategory;
			$scope.supplier = window.SAILS_LOCAL.supplier || {};
			$scope.showDevis = false;
			$scope.showBon = false;
			$scope.devis = window.SAILS_LOCAL.devis;
			$scope.produits = [];
			$scope.produit = {};
			$scope.productToCompare = window.SAILS_LOCALS.compare;
      $scope.pageSize = 5;
			$scope.currentPage = 1;


			console.log($scope.productToCompare);

			$scope.init = function (){
				if($scope.product.length <= 0){
					$scope.showTextArea = false;
				}
				else
					$scope.showTextArea = true;

				return $scope.showTextArea;
			}

			   $scope.sort = function(keyname){
			        $scope.sortKey = keyname;   //set the sortKey to the param passed
			        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
			    }

			$scope.makeDevis = function (){
				$scope.showDevis = true;
				console.log($scope.showDevis);
				return $scope.showDevis;
			}

			$scope.commander = function (){
				$scope.showBon = true;
				console.log($scope.showBon);
				return $scope.showBon;
			}

			$scope.checkIfEmpty = function (){
				if($scope.cart.totalPrice != 0){
					$scope.isEmpty = false;
				}
				else {
					$scope.isEmpty = true;
				}
				return $scope.isEmpty;
			}

		 $scope.addToCart = function (product){
		 	$http({
		 		method: 'PUT',
		 		url: '/add-to-cart/'+product.id ,
		 		data: product,
		 		headers: {
					'Content-Type':'x-www-form-urlencoded'
				}
		 	}).then( function onSuccessCallback (data) {
		 		toaster.pop({
					type: 'success', title: 'Success',
					body: 'The Product was successfully added to the cart '
				});
				window.location.reload();
		 	}, function onErrorCallback (error) {
		 		toaster.pop({
					type: 'error', title: 'Bug', body: 'Seems like something going wrong'
				});
				console.log(error);
		 	})
		 };

		 $scope.compare = function (product){
		 	$http({
		 		method: 'PUT',
		 		url: '/add-to-compare/'+product.id ,
		 		data: product,
		 		headers: {
					'Content-Type':'x-www-form-urlencoded'
				}
		 	}).then( function onSuccessCallback (data) {
		 		console.log(data);
		 		toaster.pop({
					type: 'success', title: 'Success',
					body: 'Ce produit va être comparer'
				});
				//window.location.reload();
		 	}, function onErrorCallback (error) {
		 		toaster.pop({
					type: 'error', title: 'Bug', body: 'Seems like something going wrong'
				});
				console.log(error);
		 	})
		 };

		 $scope.ajouterDansDevis = function (product){
		 	$scope.produit = { name: product, quantity: $scope.quantity};
		 	$scope.produits.push($scope.produit);
		 	console.log($scope.produits);
		 	$scope.produit = { name: "", quantity: ""};
		 }

		 $scope.ajouterDansCommande = function (product){
		 	$scope.produit = { name: product, quantity: $scope.quantity};
		 	$scope.produits.push($scope.produit);
		 	console.log($scope.produits);
		 	$scope.produit = { name: "", quantity: ""};
		 }

		 $scope.envoyerDevis = function (){
		 	var newDevis = {
		 		from: $scope.me,
		 		devis: angular.toJson($scope.produits),
		 		to : $scope.supplier.fullname
		 	};

		 	$http({
		 		method: 'POST', url: '/devis/create',
		 		data: newDevis,
		 		headers: { 'Content-Type': 'x-www-form-urlencoded'}
		 	}).then( function onSuccessCallback (data){
		 			toaster.pop({
					type: 'success', title: 'Success',
					body: 'Votre devis a été envoyé avec succès'
				});
		 			console.log(data);
		 			$scope.showDevis = false;
		 	}, function onErrorCallback (err){
		 		toaster.pop({
					type: 'error', title: 'Bug', body: 'Une erreur s\'est produite'
				});
				console.log(err);
		 	});

		 }

		 $scope.envoyerCommande = function (){
		 	var newDevis = {
		 		from: $scope.me,
		 		commande: angular.toJson($scope.produits),
		 		to : $scope.supplier.fullname
		 	};

		 	$http({
		 		method: 'POST', url: '/commande/create',
		 		data: newDevis,
		 		headers: { 'Content-Type': 'x-www-form-urlencoded'}
		 	}).then( function onSuccessCallback (data){
		 			toaster.pop({
					type: 'success', title: 'Success',
					body: 'Votre bon de commande a été envoyé avec succès'
				});
		 			console.log(data);
		 			$scope.showBon = false;
		 	}, function onErrorCallback (err){
		 		toaster.pop({
					type: 'error', title: 'Bug', body: 'Une erreur s\'est produite'
				});
				console.log(err);
		 	});
		 }

		 $scope.reduceQuantity = function (product){
		 	$http({
		 		method: 'GET',
		 		url: '/reduce/'+product.item.id ,
		 		data: product,
		 		headers: {
					'Content-Type':'x-www-form-urlencoded'
				}
		 	}).then( function onSuccessCallback (data) {
		 		toaster.pop({
					type: 'success', title: 'Success',
					body: 'The Product was successfully reduce to the cart '
				});
				window.location.href="/app/cart";
		 	}, function onErrorCallback (error) {
		 		toaster.pop({
					type: 'error', title: 'Bug', body: 'Seems like something going wrong',showCloseButton: true
				});
				console.log(error);
		 	})
		 }

		  $scope.increaseQuantity = function (product){
		 	$http({
		 		method: 'GET',
		 		url: '/add/'+product.item.id ,
		 		data: product,
		 		headers: {
					'Content-Type':'x-www-form-urlencoded'
				}
		 	}).then( function onSuccessCallback (data) {
		 		toaster.pop({
					type: 'success', title: 'Success',
					body: 'The Product was successfully added to the cart', showCloseButton: true
				});
				window.location.reload();
		 	}, function onErrorCallback (error) {
		 		toaster.pop({
					type: 'error', title: 'Bug', body: 'Seems like something going wrong'
				});
				console.log(error);
		 	})
		 }


		  $scope.remove = function (product){
		 	$http({
		 		method: 'GET',
		 		url: '/remove/'+product.item.id,
		 		data: product,
		 		headers: {
					'Content-Type':'x-www-form-urlencoded'
				}
		 	}).then( function onSuccessCallback (data) {
		 		toaster.pop({
					type: 'success', title: 'Success',
					body: 'The Product was successfully removed to the cart ', showCloseButton: true
				});
				window.location.reload();
		 	}, function onErrorCallback (error) {
		 		toaster.pop({
					type: 'error', title: 'Bug', body: 'Seems like something going wrong'
				});
				console.log(error);
		 	})
		 },

		  $scope.removeToCompare = function (product){
		  		console.log(product);
		  		$http({
		 		method: 'GET',
		 		url: '/remove/compare/'+product.item.id,
		 		data: product,
		 		headers: {
					'Content-Type':'x-www-form-urlencoded'
				}
		 	}).then( function onSuccessCallback (data) {
		 		toaster.pop({
					type: 'success', title: 'Success',
					body: 'Ce produit a été supprimé de la liste de comparaison', showCloseButton: true
				});
				window.location.reload();
		 	}, function onErrorCallback (error) {
		 		toaster.pop({
					type: 'error', title: 'Bug', body: 'Des erreurs innattendues se sont produites', showCloseButton: true
				});
				console.log(error);
		 	})

		 }

		 $scope.select = function (product){
		 	$scope.product = product;
		 }

		 $scope.parentCategory = [
			 'Electronics, Computers & Office',
			 'Clothing, Shoes & Jewelry',
			 'Books & Audible', 'Movies, Music & Games'
		 ];


		 	$http({ method: 'GET',
		 			url: '/product/category/'+$scope.product.category,
		 			headers : { 'Content-Type': 'x-www-form-urlencoded'}
		 		}).then( function onSuccessCallback (result){
		 			$scope.relatedProducts = result.data;
		 				console.log(result);
		 		}, function onErrorCallback (err){
		 			console.log(err);
		 	});

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

        $scope.stripeCallback = function (code, result) {
        	if (result.error){
        		console.log(result.error);
        	}

        	/*
				Visa card: 4242 4242 4242 4242 / 4111 1111 1111 1111
				Master Card: 5454 5454 5454 5454
        	*/
        	else {
        		$http({method: 'POST', url: '/checkout',
        			   data: {
        			   		source: result.id,
        			   		name: $scope.name,
        			   		address: $scope.address
        			   	}
        			}).then( function onSuccessCallback (data){
        				console.log(data);
        				SweetAlert.swal("Success :-)", "You successfully bought those products", "success");
        				window.location.href="/";
        			}, function onErrorCallback (err){
        				console.log(err);
        			})
        	}

        }

        $http({ method: 'GET',
        	url: 'https://openexchangerates.org/api/latest.json?app_id=23f2358c54e643378fbe29e4827c1ffa',
        	headers: {
        		'Content-Type': 'x-www-form-urlencoded'
        	}}).then (function onSuccessCallback (result){
        		$scope.currency = result.data.rates;
        		console.log($scope.currency);
        	}, function onErrorCallback (err){
        		console.log(err);
        	});

        $http({ method: 'GET', url: '/suppliers', headers: {'Content-Type': 'x-www-form-urlencoded'}
        	}).then (function onSuccessCallback (result){
        		$scope.suppliers = result.data;
        		//$scope.produits = result.data.products;
        		console.log($scope.suppliers);
        		console.log($scope.produits);
        	}, function onErrorCallback (err){
        		console.log(err);
        });


        $scope.createComment = function (product){
        	var newComment = {
        		review: $scope.comment.review
        	};

        	$http({ method: 'POST',
        			url: '/product/'+product.id+'/comment/create',
        			data: newComment,
        			headers: { 'Content-Type': 'x-www-form-urlencoded'}
        		}).then( function onSuccessCallback (data) {
        			toaster.pop({ title: 'Success', type: 'info', body: 'A new comment was post successfully', showCloseButton: true});
        			console.log(data);
        			$scope.product.comments.push(data);
        			window.location.reload();
        		}, function onErrorCallback (err){
        			console.log(err);
        		});
        }




	}]);

	frontApp.controller('customerController', ['$scope', '$http', 'toaster', function ($scope, $http, toaster){
		console.log("Welcome to the customerController");
		$scope.passwordRecoveryToken = window.SAILS_LOCALS.passwordRecoveryToken || '';
		$scope.login = function (){
			var credentials = {
				email: $scope.user.email,
				username: $scope.user.username,
				password: $scope.user.password
			}
			$http.put('/login', credentials)
				 .then(function onSuccessCallback (data){
				  	toaster.pop({type: 'success', title: 'Success',body: "Connexion réussie avec succès",showCloseButton: true});
				  		console.log(data);
				  	 window.location.href= "/";

				  }, function onErrorCallback (error){
				  		console.log(error);
				  		toaster.pop({type: 'error', title: 'Oups',body: error.data, showCloseButton: true});
				  })
		}



		$scope.signup= function (){

			var newUser = {
				fullname : $scope.user.fullname,
				email: $scope.user.email,
				username: $scope.user.username,
				password: $scope.user.password,
				role: $scope.user.role
			 };

			$http({
						method: 'POST',
						url: '/signup',
						data: newUser
				})
				.then( function onSuccessCallback (data){
					 		console.log(data);
					 		toaster.pop({type: 'success', title: 'Success',body: "Votre compte a été créé succès",showCloseButton: true});
						 		alert("Success Insertion");
					}, function onErrorCallback (error){
						console.log(error);
						toaster.pop({type: 'error', title: 'Oups',body: "La création de votre compe a échoué, Vérifiez votre mot de passe et votre nom utilisateur", showCloseButton: true});

				});

		};

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
				toaster.pop({type: 'success', title: 'Email envoyé!', body: 'Un mail vous a été envoyé pour réinitialiser votre mot de passe', showCloseButton: true});
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
				toaster.pop({type: 'info', title: 'Opération réussie!', body: 'Le Mot de passe a été réinitialisé avec succès', showCloseButton: true});
				window.location.href="/";
			}, function errorCallback (error) {
				toaster.pop({type: 'error',title: 'Error',body: error,showCloseButton: true});
			})
		}
	}])

})()
