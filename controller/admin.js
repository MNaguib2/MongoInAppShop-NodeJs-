const Product = require('../models/product');

exports.getAddediteProduct = (req, res, next) => {
  //if(req.session.isLoggedIn) { //this is commented to use different way to product url link
    const title = ((req.baseUrl + req.url) == '/admin/add-product') ? "Add Product" : "Edit Product";
      res.render('admin/edite or add-product', {
        pageTitle: title,
        path: req.baseUrl + req.url,
        //productCSS: false,
        editing: false, //(title == 'Add Product') ? false : true,
        product: null,
        //formsCSS: true,
        isAuthenticated: req.session.isLoggedIn
      });  
    // } else {
    //   res.redirect('/');
    // }
  };

exports.postAddProduct = (req, res) => {
    const addproduct = new Product
    ({title : req.body.title, price : req.body.price,description: req.body.description,imageUrl: req.body.imageurl, userId: req.user /*._id*/ //in here not important add ._id app automatically get id 
    })
    addproduct.save()
    .then(result => {
      console.log((result ? 'Added Successful !' : 'Occoured Error !') + ' (this in AdminController Func Post add)');
      res.redirect('/')
    })
    .catch(err => console.log(err))
  };
  
  exports.getEditProduct = (req, res) => {
    if(req.session.isLoggedIn) {
    const title = ((req.baseUrl + req.url) == '/admin/add-product') ? "Add Product" : "Edit Product";
    Product.findById(req.params.productid)
    .then(result =>{
      res.render('admin/edite or add-product', {
        pageTitle: title,
        path: req.baseUrl + req.url,
        editing: true,
        product: result,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err));
  } else {
    res.redirect('/');
  }
  }

  exports.postEditeProduct = (req, res) => {
    Product.findByIdAndUpdate(req.params.productid, 
      {title: req.body.title, price: req.body.price, 
        description: req.body.description, imageUrl: req.body.imageurl})
        .then(result => {
          console.log((result ? 'Edit Successful !' : 'Occoured Error !') + ' (this in AdminController Func Post Edit)');
          res.redirect('/');
        }).catch(err => console.log(err));

      /* this is another way by new think
      const prodId = req.body.productId;
      const updatedTitle = req.body.title;
      const updatedPrice = req.body.price;
      const updatedImageUrl = req.body.imageUrl;
      const updatedDesc = req.body.description;

      Product.findById(prodId)
        .then(product => {
          product.title = updatedTitle;
          product.price = updatedPrice;
          product.description = updatedDesc;
          product.imageUrl = updatedImageUrl;
          return product.save();
        })
        .then(result => {
          console.log('UPDATED PRODUCT!');
          res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
    //*/
  }

  exports.getProducts = (req, res) => {
    if(req.session.isLoggedIn) {
    Product.find({userId: req.session.user._id})
    //.select('title price') //to show just only specfice detials from documention 
    //.populate('userId', 'name')//to show some data from another collection related to relationship
    .then(result => {
      res.render('admin/products' ,{
        pageTitle: 'Admin Products',
        path: req.baseUrl + req.url,
        prods: result,
        isAuthenticated: req.session.isLoggedIn
      })
    }).catch(err => console.log(err))
  } else {
    res.redirect('/');
  }
  }

  exports.postdeleteproduct = (req , res) => {
    Product.findByIdAndDelete(req.params.productid)
    .then(result => {
      console.log((result ? 'Deleted Successful !' : 'Occoured Error !') + ' (this in AdminController Func Post Deleted)');
      res.redirect('/');
    }).catch(err => console.log(err));
  }