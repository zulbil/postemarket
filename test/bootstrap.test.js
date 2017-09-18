var Sails = require('../node_modules/sails'); 

var sails = require('sails'); 

before(function (done){
	Sails.lift({
		log: {
			level: 'error'
		}, 
		hook: {
			grunt: false
		}
	}, done);
});

after(function (done){
 Sails.lower(done); 
});