const path = require('path');

const express = require('express');

const router = express.Router();

const ShopController = require('../controller/shop');
	
router.get('/', ShopController.getIndex);
 router.get('/products', ShopController.getProducts);
 router.get('/products/:productid', ShopController.getDetials);
// router.get('/card', ShopController.getCard);
router.post('/card', ShopController.postcardid);
// router.post('/card-delete-item', ShopController.postCardDeleteProduct);
// router.post('/create-order', ShopController.postcreateorder);
// router.get('/order', ShopController.getOrder);

/*
router.get('/checkout', ShopController.getcheckout);
*/
  
router.get('**', (req, res, next)=>{
    res.redirect('/');
  });

module.exports = router;
