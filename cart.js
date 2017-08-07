
module.exports = function Cart (oldCart) {
	this.items = oldCart.items || {}; 
	this.totalQty = oldCart.totalQty || 0; 
	this.totalPrice = oldCart.totalPrice || 0;
 	
 	this.add = function (item, id) {
 		var storedItem = this.items[id]; 
 		if(! storedItem){
 			storedItem = this.items[id]= {item : item, quantity: 0, price: 0}; 
 		}
 		storedItem.quantity++;
 		storedItem.price = storedItem.item.price * storedItem.quantity;
 		this.totalQty++;
 		this.totalPrice +=storedItem.item.price;
 	};

 	this.toArray = function () {
 		var array = []; 
 		for( var i in this.items){
 			array.push(this.items[i]); 
 		}
 		return array;
 	}

 	this.remove = function (id){
 		this.totalQty -=this.items[id].quantity;
 		this.totalPrice -= this.items[id].price; 
 		delete this.items[id]; 
 	}

 	this.reduceByOne = function (id) {
 		console.log(this.items[id]);
 		this.items[id].quantity--; 
 		this.items[id].price-=this.items[id].item.price; 
 		this.totalQty --; 
 		this.totalPrice -=this.items[id].item.price; 

 		if (this.items[id].quantity <= 0){
 			delete this.items[id];
 		}
 	}

 	this.addByOne = function (id) {
 		this.items[id].quantity++; 
 		this.items[id].price+=this.items[id].item.price; 
 		this.totalQty ++; 
 		this.totalPrice += this.items[id].item.price; 
 	}

};

