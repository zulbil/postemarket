
	app.controller('ProductController', ['$scope','$http','filepickerService', 'SweetAlert',function ($scope, $http, filepickerService, SweetAlert){
		console.log('Welcome to the ProductController'); 
		$scope.products = []; 
		$scope.showForm = false; 
		$scope.pageSize = 5; 
		$scope.currentPage = 1; 
		$scope.showEditForm = false; 
		$scope.product = {};
		//$scope.currentProduct = {};

		$scope.sort = function (keyname){
			$scope.sortKey = keyname; 
			$scope.reverse = !$scope.reverse; 
		}

		$scope.alertSuccess = function (){
			SweetAlert.swal("Good job!", "Product was successfully added", "success");
		}

		
		$scope.getAllProducts = function(){
			io.socket.get('/product', function whenServerResponds (data, JWR){
				if(JWR.statusCode >=400){
					console.log("Something wrong"); 
					return; 
				}
				$scope.products = data; 

				$scope.$apply(); 

			//Listen for event applied in product object
			io.socket.on('product', function whenActionOccurs (event){

				$scope.products.unshift({
					name: event.data.name, 
					category: event.data.category, 
					price: event.data.price, 
					picture: event.data.picture, 
					morePictures: event.data.morePictures, 
					quantity: event.data.quantity,  
					status: event.data.status, 
					createdAt: event.data.createdAt, 
					description: event.data.description, 
					owner: event.data.owner
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
            function(Blob){
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

		$scope.addProduct = function (){ 

			var newProduct = {
				name: $scope.product.name, 
				category: $scope.product.category, 
				price: $scope.product.price, 
				picture: $scope.product.picture, 
				morePictures: [], 
				quantity: 10,  
				status: "Pending", 
				createdAt: Date.now(), 
				description: $scope.product.description, 
				owner: "Joel Alexandre Khang Zulbal"
			}; 

			console.log(newProduct); 

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
			$http.put('product/update/'+product.id, product)
			     .then(function onSuccessCallback(){
					$scope.currentProduct = product;
					$scope.$apply();      	
			     },function errorCallback (error){
			     	console.log(error); 
			     });
			
		}

		$scope.updateProduct = function (){
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

	}]); 
	