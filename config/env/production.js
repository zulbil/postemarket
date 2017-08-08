/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  models: {
    connection: 'MongodbServer'
  },

  session: {
  	adapter: 'redis', 
  	url: 'redis://redistogo:06eaeeaae7055cd4d693d23d2f2cdf11@angelfish.redistogo.com:11228/'
  }, 

  sockets: {
    adapter: 'socket.io-redis', 
     url: 'redis://redistogo:06eaeeaae7055cd4d693d23d2f2cdf11@angelfish.redistogo.com:11228/'
  }

};
