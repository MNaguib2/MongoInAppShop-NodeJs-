const path = require('path');

const express = require('express');

const router = express.Router();

const ShopController = require('../controller/shop');

const middleware = require('../middleware/is-auth'); //this is different way to product url link
	
 router.get('/', ShopController.getIndex);
 router.get('/products', ShopController.getProducts);
 router.get('/products/:productid', ShopController.getDetials);
 router.get('/card', ShopController.getCard);
 router.post('/card', ShopController.postcardid);
 router.post('/card-delete-item', ShopController.postCardDeleteProduct);
 router.post('/create-order', ShopController.postcreateorder);
 router.get('/order', ShopController.getOrder);
 router.post('/clear-order', ShopController.clearOrder);

 router.get('/order/:orderID',middleware, ShopController.getInvoice);

  
router.get('**', (req, res, next)=>{
    res.redirect('/');
  });

module.exports = router;
