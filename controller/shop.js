const Product = require('../models/product');

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
    /*
    Product.findByPk(req.params.productid)
    .then(result => {
        res.render('shop/product-detials', {
            product: result,
            pageTitle: 'Your Order',
            path: req.url            
        })
    })
    .catch(err => {
        console.log(err);
//     });
//     //*/
}
// exports.getCard = (req, res, next) => {
//     console.log('this is new way ', req.user);
//     req.user.getCard()
//         .then(card => {
//             return card.getProducts()
//                 .then(product => {
//                     res.render('shop/card', {
//                         pageTitle: 'Your Cart',
//                         path: req.url,
//                         products: product
//                     });
//                 })
//                 .catch(err => console.log(err));
//         })
//         .catch(err => console.log(err));
// }
// exports.postcardid = (req, res, next) => {
//     const prodId = req.body.productId;
//     let fetchedCard;
//     let newQuantity = 1;
//     req.user.getCard()
//         .then(card => {
//             fetchedCard = card;
//             return card.getProducts({ where: { id: prodId } })
//         })
//         .then(products => {
//             let product;
//             if (products.length > 0) {
//                 product = products[0];
//             }
//             if (product) {
//                 const oldQuantity = product.carditem.quantity;
//                 newQuantity = oldQuantity + 1;
//             }
//             return Product.findByPk(prodId)
//         })
//         .then(product => {
//             return fetchedCard.addProduct(product, {
//                 through: { quantity: newQuantity }
//             });
//         })

//         .then(result => {
//             res.redirect('/card');
//         })
//         .catch(err => console.log(err));
// }
// exports.postCardDeleteProduct = (req, res, next) => {
//     const productid = req.body.productId;
//     req.user.getCard()
//         .then(card => {
//             return card.getProduct({ where: { id: productid } });
//         })
//         .then(result => {
//             const product = result[0];
//             return product.carditem.destroy();
//         })
//         .catch(err => console.log(err));
// }

// exports.postcreateorder = (req, res, next) => {
//     let fetchedCard;
//     req.user.getCard()
//         .then(card => {
//             fetchedCard = card;
//             return card.getProducts();
//         })
//         .then(product => {
//             return req.user.createOrder()
//                 .then(order => {
//                     order.addProduct(product.map(product => {
//                         product.orderitem = { quantity: product.carditem.quantity };
//                         return product;
//                     }))
//                 }).catch(err => console.log(err))
//         }).then(result => {
//             return fetchedCard.setProducts(null);
//         }).then(result => {
//             res.redirect('/order');
//         })
//         .catch(err => console.log(err));
// }
// exports.getOrder = (req, res, next) => {
//     req.user.getOrders({ include: ['products'] })
//         .then(order => {
//             res.render('shop/orders', {
//                 path: req.url,
//                 pageTitle: 'Your Order',
//                 orders: order
//             });
//         })
//         .catch(err => console.log(err))
// }