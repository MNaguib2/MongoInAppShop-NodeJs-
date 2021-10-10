const Product = require('../models/product');
const User = require('../models/User');

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
    .then(result => {
        res.render('shop/index', {
            prods: result,
            pageTitle: 'shop',
            path: req.url
        })
    })
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(result => {
            res.render('shop/product-list', {
                prods: result,
                pageTitle: 'All Products',
                path: req.url
            })
        })
        .catch(err => {
            console.log(err)
        });
}
exports.getDetials = (req, res, next) => {
    Product.findById(req.params.productid)
        .then(result => {
            res.render('shop/product-detials', {
                product: result,
                pageTitle: result.title,
                path: req.url
            })
        })
        .catch(err => {
            console.log(err);
        });
}
exports.getCard = (req, res, next) => {
    req.user.getCart()
            .then(card => {
                //console.log(card)
                    res.render('shop/card', {
                        pageTitle: 'Your Cart',
                        path: req.url,
                        products: card
                })
        })
        .catch(err => console.log(err));
}
exports.postcardid = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(result => {
        return req.user.addToCart(result);
    })
    .then(result => {
        //console.log(result);
        res.redirect('/card');
      })
    .catch(err => console.log(err));
}
exports.postCardDeleteProduct = (req, res, next) => {
    const productid = req.body.productId;
    req.user.deleteItemFromCart(productid)
        .then(card => {
            res.redirect('/card');
        })
        .catch(err => console.log(err));
}

exports.postcreateorder = (req, res, next) => {
   req.user.addOrder()
   .then(result => {
    res.redirect('/order');
   })
   .catch(err => console.log(err));
}
exports.getOrder = (req, res, next) => {
    req.user.getOrders()
        .then(order => {
            res.render('shop/orders', {
                path: req.url,
                pageTitle: 'Your Order',
                orders: order
            });
        })
        .catch(err => console.log(err))
}