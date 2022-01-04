const fs = require('fs');
const path = require('path');

const Product = require('../models/product');
const Order = require('../models/order');
const order = require('../models/order');
const PDFDocument = require('pdfkit'); //this is first step to create file web

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(result => {
      //console.log(result);
      res.render('shop/index', {
        prods: result,
        pageTitle: 'shop',
        path: req.url,
        //isAuthenticated: req.session.isLoggedIn,
        //csrfToken : req.csrfToken() // to made this way in all page when render all from backend this way is cumbersome and will demonistrating another way is convenient
      })
    })
  //console.log(req.session.isLoggedIn)
}
exports.getDetials = (req, res, next) => {
  //Product.findById(req.params.productid)//this is two way to find elements
  Product.findOne({ _id: req.params.productid })
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
  if (req.session.isLoggedIn) {
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
          email: req.user.email,
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
  if (req.session.isLoggedIn) {
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

exports.getInvoice = (req, res, next) => {
  // console.log('test');
  const orderID = req.params.orderID;
  order.findById(orderID)
  .then(result => {
    // console.log(result.user.userId);
    // console.log(req.session.user._id);
    if(result.user.userId.toString() === req.session.user._id.toString()){
      //console.log(result.user.userId.toString() + ' ' + req.session.user._id.toString())
      const fileName = `invoice-${orderID}.pdf`;
      const invoicePath = path.join('data', 'invoices', fileName);
      //all this comment to this way will store file in memory before send and this will loading in memory if comming more request
      //and instead use this will use streaming 
      // fs.readFile(invoicePath, (err, data) => { 
        
      //   if (err) {
      //     return next(err);
      //   }
      //   //console.log(data);
      //   res.setHeader('Content-Type', 'application/pdf');
      //   //this is way to can browser know what type file we will present if know this can review in site
      //   res.setHeader(
      //     'Content-Disposition',
      //     //this to define how this content should be served to the client
      //     'inline; filename="'
      //     /* 'inline' to still tell the browser to open it inline but we can change in line and add 'attachment' to download file
      //     and then add filename 
      //     and set this equal to in double quotation marks 
      //     the file name yu want to serve */
      //     + fileName + '"'
      //   );
      //   res.send(data)    
      // })
      // const file = fs.createReadStream(invoicePath);
      //   res.setHeader('Content-Type', 'application/pdf');
      //   //this is way to can browser know what type file we will present if know this can review in site
      //   res.setHeader(
      //     'Content-Disposition',
      //     //this to define how this content should be served to the client
      //     'inline; filename="'
      //     /* 'inline' to still tell the browser to open it inline but we can change in line and add 'attachment' to download file
      //     and then add filename 
      //     and set this equal to in double quotation marks 
      //     the file name yu want to serve */
      //     + fileName + '"'
      //   );

        const  pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(25).text('hellow World !!' , {
          underline: true,
          align: 'center'
        });
        pdfDoc.text('--------------------------------------------------------' , {
          align: 'center'
        })
        let totalPrice = 0;
        result.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              ' - ' +
              prod.quantity + 
              ' x ' +
              '$' +
              prod.product.price
          );
      });
      pdfDoc.text('---');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
        pdfDoc.end();

        //pipe methode to the forward the data that is read in with that stream to my response 
        //so we can pipe our readable stream, the file stream into the response and that means that the response will bbe steamed to the browser 
        //and will contain the data and the data will basically be download by the browser step by step and for large files 
        //here we don't wait for all the chuncks to come together and concatenate them into one objective
        file.pipe(res)
    }else{
      return next(new Error('UnAuthorized'));
    }
  })
  .catch(err => console.log(err));
  // const fileName = `invoice-${orderID}.pdf`;
  // const invoicePath = path.join('data', 'invoices', fileName);
  // fs.readFile(invoicePath, (err, data) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   //console.log(data);
  //   res.setHeader('Content-Type', 'application/pdf');
  //   //this is way to can browser know what type file we will present if know this can review in site
  //   res.setHeader(
  //     'Content-Disposition',
  //     //this to define how this content should be served to the client
  //     'inline; filename="'
  //     /* 'inline' to still tell the browser to open it inline but we can change in line and add 'attachment' to download file
  //     and then add filename 
  //     and set this equal to in double quotation marks 
  //     the file name yu want to serve */
  //     + fileName + '"'
  //   );
  //   res.send(data);
  // })
}


