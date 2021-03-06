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

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/
  hookTimeout: 40000, 
  models: {
    connection: 'MongodbServer'
  }, 

  session: {
    adapter: 'redis', 
     url: 'redis://redistogo:06eaeeaae7055cd4d693d23d2f2cdf11@angelfish.redistogo.com:11228'
  }, 

  sockets: {
    adapter: 'socket.io-redis', 
     url: 'redis://redistogo:06eaeeaae7055cd4d693d23d2f2cdf11@angelfish.redistogo.com:11228'
  }

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  // port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

};
