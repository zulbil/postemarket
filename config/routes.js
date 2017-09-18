/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
  
  'POST /signup':'UserController.signup',
  'PUT /login': 'UserController.login', 
  'GET /logout':'UserController.logout',
  'DELETE /user/delete/:id':'UserController.delete',
  'PUT /removeProfile/:id':'UserController.removeProfile',
  'PUT /restoreProfile:id':'UserController.restoreProfile',
  'PUT /updateProfile/:id':'UserController.updateProfile',
  'GET /getAllUsers':'UserController.adminUser',
  'GET /suppliers':'UserController.getAllSuppliers',
  'GET /user/:id':'UserController.profile',
  'PUT /updateDeleted/:id':'UserController.updateDeleted',
  'PUT /updateBanned/:id':'UserController.updateBanned',
  'PUT /updateProfilePicture/:id':'UserController.updateProfilePicture',
  'PUT /user/generate-recovery-email': 'UserController.generateRecoveryEmail',
  'PUT /user/reset-password': 'UserController.resetPassword',
  'PUT /user/changePassword/:id':'UserController.changePassword',

  'GET /product/all': 'ProductController.getAllProducts',
  'GET /product/category/:name': 'ProductController.getAllProductPerCategories',
  'GET /product/:id': 'ProductController.getProductOne',
  'POST /product/create': 'ProductController.createProduct',
  'PUT /product/update/:id': 'ProductController.updateProduct',
  'GET /product/comments':'ProductController.allCommentsByProduct',
  'GET /product/search/:searchCriteria': 'ProductController.searchProduct',
  'DELETE /product/destroy/:id': 'ProductController.deleteProduct',
  'GET /category/name/:name':'CategoryController.categoryByName',
  'GET /category/parent/:name':'CategoryController.categoryByParent',
  'GET /category/all':'CategoryController.all',
  'GET /orders/all':'OrderController.getAllOrders',
  'GET /categories':'CategoryController.allCategories',
  'PUT /add-to-cart/:id':'ProductController.addToCart',
  'PUT /add-to-compare/:id':'ProductController.addToCompare',
  'POST /devis/create':'DevisController.createDevis',
  'POST /commande/create':'CommandeController.createCommande',
  'POST /checkout':'OrderController.checkout',
  'POST /product/:id/comment/create': 'CommentController.createComment',
  'GET /reduce/:id': 'ProductController.reduceItemToTheCart',
  'GET /add/:id': 'ProductController.addItemToTheCart',
  'GET /remove/:id': 'ProductController.removeItemToTheCart',
  'GET /remove/compare/:id': 'ProductController.removeItemToCompare',
  'GET /order/supplier': 'OrderController.getOrderBySupplier',
  'GET /order/user/:id': 'OrderController.getOrderByUser',
  'GET /comment/user': 'CommentController.allComments',

  // Server render HTML views
  'GET /admin/adminPortal': 'PageController.showAdminPage',
  'GET /admin/user/profile/:id':'PageController.showUserProfile',
  'GET /profile': 'PageController.showProfilePage', 
  'GET /back/dashboard': 'PageController.showDashboardPage', 
  'GET /back/devis': 'PageController.showManagementDevisPage', 
  'GET /back/devis-detail/:id': 'PageController.showDevisDetailPage', 
  'GET /back/commandes':'PageController.showManagementCommandePage',
  'GET /back/commande-detail/:id':'PageController.showCommandeDetailPage',
  'GET /back/products': 'PageController.showProductPage',
  'GET /app/password-reset-form/:passwordRecoveryToken': 'PageController.passwordReset', 
  'GET /': 'PageController.showHomePage',
  'GET /app/products': 'PageController.showProductAppPage',
  'GET /app/product/:id': 'PageController.showOneProductAppPage',
  'GET /app/signup': 'PageController.showRegisterFrontPage',
  'GET /app/login': 'PageController.showLoginFrontPage',
  'GET /app/forgot': 'PageController.showForgotPage',
  'GET /app/contact': 'PageController.showContactPage', 
  'GET /app/cart': 'PageController.showCartPage', 
  'GET /app/category/:name/products': 'PageController.showCategoryPage', 
  'GET /app/checkout':'PageController.showCheckoutPage', 
  'GET /app/orders': 'PageController.showOrderPage', 
  'GET /app/order/:id': 'PageController.showOrderDetailPage', 
  'GET /app/manufacturers': 'PageController.showManufacturerPage', 
  'GET /app/manufacturer/:id': 'PageController.showManufacturerDetailPage', 
  'GET /app/devis':'PageController.showDevisPage', 
  'GET /app/compare': 'PageController.showComparePage'
};
