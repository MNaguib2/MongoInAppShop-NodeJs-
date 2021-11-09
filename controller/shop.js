const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
    Product.find()
    .then(result => {
            res.render('shop/index', {
            prods: result,
            pageTitle: 'shop',
            path: req.url,
            isAuthenticated: req.session.isLoggedIn,
            csrfToken : req.csrfToken()
        })
    })
    //console.log(req.session.isLoggedIn)
}
exports.getDetials = (req, res, next) => {
    //Product.findById(req.params.productid)//this is two way to find elements
    Product.findOne({_id : req.params.productid})
        .then(result => {
            res.render('shop/product-detials', {
                product: result,
                pageTitle: result.title,
                path: req.url,
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(result => {
            res.render('shop/product-list', {
                prods: result,
                pageTitle: 'All Products',
                path: req.url,
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => {
            console.log(err)
        });
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
/*this is way to getCard by mongoose and exsit another way follow to learn
exports.getCard = (req, res, next) => {
    req.user.getCart()
            .then(card => {
                console.log(card);
                    res.render('shop/card', {
                        pageTitle: 'Your Cart',
                        path: req.url,
                        products: card
                })
        })
        .catch(err => console.log(err));
}
//in this below will dimonistrating another way to get card*/ 

exports.getCard = (req, res, next) => {
  if(req.session.isLoggedIn) {    
    req.user
    .populate('cart.items.productId')
    //.execPopulate()
            .then(card => {
                //console.log(card.cart.items);
                    res.render('shop/card', {
                        pageTitle: 'Your Cart',
                        path: req.url,
                        products: card.cart.items,
                        isAuthenticated: req.session.isLoggedIn
                })
        })
        .catch(err => console.log(err));
      } else {
        res.redirect('/');
      }
}

exports.postCardDeleteProduct = (req, res, next) => {
   const id = req.body.productId;
   req.user.deleteItemFromCart(id)
   .then(result => {
    res.redirect('back');
    console.log((result ? 'Deleted from Card Successful !' : 'Occoured Error !') + ' (this in shopController Func postCardDeleteProduct)');
   })
   .catch(err => console.log(err));
}


exports.postcreateorder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    //.execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/order');
    })
    .catch(err => console.log(err));
};

exports.getOrder = (req, res, next) => {
  if(req.session.isLoggedIn) {
  Order.find({ 'user.userId': req.session.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: req.url,
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
  } else {
    res.redirect('/');
  }
};

exports.clearOrder = (req, res, next) => {
  Order.deleteMany()
  .then(result => {
    console.log((result ? 'Deleted from Order Successful !' : 'Occoured Error !') + ' (this in shopController Func postclearOrder)');
    res.redirect('/');
  }).catch(err => console.log(err));
}