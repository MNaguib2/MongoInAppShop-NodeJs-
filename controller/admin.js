const Product = require('../models/product');

exports.getAddediteProduct = (req, res, next) => {
  const title = ((req.baseUrl + req.url) == '/admin/add-product') ? "Add Product" : "Edit Product";
    res.render('admin/edite or add-product', {
      pageTitle: title,
      path: req.baseUrl + req.url,
      //productCSS: false,
      editing: false, //(title == 'Add Product') ? false : true,
      product: null
      //formsCSS: true
    });  
};

exports.getProducts = (req, res, next) => {
Product.fetchAll()
  .then(resule => {
    res.render('admin/products', {
      prods: resule,
      pageTitle: 'Admin Products',
      path: req.baseUrl + req.url,
    });
  })
  .catch(err => {
    console.log(err);
  });
}

exports.postdeleteproduct = (req, res, next) => {
  const productid = req.params.productid;
  if (productid) {
    Product.findById(productid)
    .then(result => {
     return Product.Delete(productid);
    })
    .then(result =>  {
      console.log((result.acknowledged ? 'DELETED PRODUCT IS DONE!!' : 'Accoured Error !') + ' (this in AdminController Func Post Delete)');
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    });
  }
}

exports.postAddProduct = (req, res) => {
  const addproduct = new Product
  (req.body.price, req.body.title, req.body.description, req.body.imageurl, req.user._id)
  addproduct.save()
  .then(result => {
    console.log((result.acknowledged ? 'Added Successful !' : 'Accoured Error !') + ' (this in AdminController Func Post add)');
    res.redirect('/')
  })
  .catch(err => console.log(err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edite;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productid;

  Product.findById(prodId)
  .then(rows => {
    if (!rows) {
      return res.redirect('/');
    }
    res.render('admin/edite or add-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: rows
    });
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postEditeProduct = (req, res) => {
  const prodId = req.params.productid;
  const products = new Product (req.body.price, req.body.title, req.body.description, req.body.imageurl);
  products.Update(prodId)
  .then(result => {
    console.log((result.acknowledged ? 'Update Successful !' : 'Accoured Error !') + ' (this in AdminController Func Post edit)');
  })
  .catch(err => console.log(err));
  res.redirect('/');    
};