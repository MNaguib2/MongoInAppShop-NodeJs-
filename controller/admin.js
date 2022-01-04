const Product = require('../models/product');
const { validationResult } = require('express-validator');
const fileHelper = require('../util/file');
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
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: ''
      });  
    // } else {
    //   res.redirect('/');
    // }
  };

exports.postAddProduct = (req, res, next) => {
  //console.log(req.baseUrl + req.url);
  const title = ((req.baseUrl + req.url) == '/admin/add-product') ? "Add Product" : "Edit Product";
    if(!req.file){
      return res.status(422).render('admin/edite or add-product', {
        pageTitle: title,
        path: req.baseUrl + req.url,
        //productCSS: false,
        editing: false, //(title == 'Add Product') ? false : true,
        product: null,
        //formsCSS: true,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage : 'Please add Image'
      })
    }
    const addproduct = new Product
    ({
      title : req.body.title, 
      price : req.body.price,
      description: req.body.description,
      // imageUrl: req.body.imageurl, 
      imageUrl: req.file.path,    //if same name file exist already replace this  
      userId: req.user /*._id*/ //in here not important add ._id app automatically get id 
    })
   //console.log(req.file);
    addproduct.save()
    .then(result => {
      //throw new Error('Dummy'); //this is Just test to inhernet middele wire test 
      console.log((result ? 'Added Successful !' : 'Occoured Error !') + ' (this in AdminController Func Post add)');
      res.redirect('/')
    })
    .catch(err => {
      //console.log(err)
      console.log('test');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
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
        isAuthenticated: req.session.isLoggedIn,
        errorMessage : ''
      })
    })
    .catch(err => console.log(err));
  } else {
    res.redirect('/');
  }
  }

  exports.postEditeProduct = (req, res) => {
    const errors = validationResult(req);
    //console.log(errors);
    if(errors.isEmpty()){
    Product.findById(req.params.productid)
    .then(result => {
      fileHelper.deletFile(result.imageUrl);
    })
    .catch(err => console.log(err));
    Product.findByIdAndUpdate(req.params.productid, 
      {title: req.body.title, price: req.body.price, 
        description: req.body.description, imageUrl: 
        /* 
        req.body.imageurl //this comment to use upload file from package multer 
        //*/ 
        req.file.path})
        .then(result => {
          console.log((result ? 'Edit Successful !' : 'Occoured Error !') + ' (this in AdminController Func Post Edit)');
          res.redirect('/');
        }).catch(err => console.log(err));
      }else{
        const title = ((req.baseUrl + req.url) == '/admin/add-product') ? "Add Product" : "Edit Product";
        const result ={
           title: req.body.title,
           price: req.body.price,
           description: req.body.description,
           imageUrl: req.body.imageurl,
           _id : req.params.productid
        }
        //console.log(result);
      return res.status(422).render('admin/edite or add-product', {
        pageTitle: title,
        path: req.baseUrl + req.url,
        editing: true,
        product: result,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage : errors.array()[0].msg
      })
      }
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
      //console.log(result);
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
    Product.findById(req.params.productid)
    .then(result => {
      fileHelper.deletFile(result.imageUrl);
    }).catch(err => {
      console.log(err)
    });
    Product.findByIdAndDelete(req.params.productid)
    .then(result => {
      console.log((result ? 'Deleted Successful !' : 'Occoured Error !') + ' (this in AdminController Func Post Deleted)');
      res.redirect('/');
    }).catch(err => {
      console.log(err)
    });
  }

  exports.deleteproduct = (req , res) => {
    Product.findById(req.params.productid)
    .then(result => {
      fileHelper.deletFile(result.imageUrl);
    }).catch(err => {
      console.log(err)
    });
    Product.findByIdAndDelete(req.params.productid)
    .then(result => {
      console.log((result ? 'Deleted Successful !' : 'Occoured Error !') + ' (this in AdminController Func Post Deleted)');
      res.status(200).json({message: 'Success !'});
    }).catch(err => {
      res.status(500).json({message : 'Deleting Product Faild'});
    });
  }