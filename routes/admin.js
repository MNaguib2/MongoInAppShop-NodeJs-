const { check , body } = require('express-validator');
const express = require('express');

const router = express.Router();

const AdminController = require('../controller/admin');

const middleware = require('../middleware/is-auth'); //this is different way to product url link


  router.get('/add-product',middleware, AdminController.getAddediteProduct); // this is another way

  router.post('/add-product' , AdminController.postAddProduct);

  router.get('/products', AdminController.getProducts);

  router.get('/edite-product/:productid' , AdminController.getEditProduct);

  router.post('/edite-product/:productid' , 
    body('title')
    .isLength({ min: 5 })
    .withMessage('Please Entre More Chrackter')
    .isString()            
    .withMessage('Please Entre Valid Title'),
  AdminController.postEditeProduct);

  router.post('/delete-product/:productid',AdminController.postdeleteproduct);

  // router.get('**', (req, res, next)=>{
  //   res.redirect('/');
  // });

  router.delete('/delete-product/:productid', middleware ,AdminController.deleteproduct); //this is another way to work as a RESTFUL
 

  module.exports = router;


//www.ShareAppsCrack.com or www.shareappscrack.com