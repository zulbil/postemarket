/**
 * Order.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	user: { model: 'user' }, 
  	cart : { type: 'json'}, 
  	address: {type: 'string', required: true }, 
  	name: {type: 'string', required: true }, 
  	paymentId: { type: 'string', required: true}
  }
};

