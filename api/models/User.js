/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    fullname: { type: 'string', required: true},
    email: { type: 'string', email: true, unique: true, required: true },
    tel: { type: 'string', defaultsTo: '' },
    address: { type: 'string', defaultsTo: ''}, 
    city: { type:'string', defaultsTo: ''},
    country: { type: 'string', defaultsTo: ''}, 
    username: { type: 'string', unique: true, required: true },
    password: { type: 'string', required: true },
    passwordRecoveryToken : {type: 'string'},
    profilePicture: { 
      type: 'string', 
      defaultsTo:'https://www.skirmish-vt.com/Images/icons/default-avatar.png'
    },
    role: {
        type: 'string', 
        enum: ['customer', 'supplier', 'admin'],
        defaultsTo: 'customer'
    },
    deleted: {
        type: 'boolean', 
        enum: [false, true], 
        defaultsTo: false
      },
    banned: {
        type: 'boolean', 
        enum: [false, true], 
        defaultsTo: false
      },
    products: {
      collection: 'product', 
      via: 'owner'
    }, 
    orders: {
      collection: 'order', 
      via: 'user'
    },
    comments: {
      collection: 'comment', 
      via: 'postedBy'
    },
    devis : {
      collection: 'devis', 
      via: 'from'
    }, 
    commandes: {
      collection: 'commande', 
      via: 'from'
    },
    
      toJSON: function(){
        var modelAttributes = this.toObject(); 
        delete modelAttributes.password; 
        return modelAttributes; 
      }
  }
};

