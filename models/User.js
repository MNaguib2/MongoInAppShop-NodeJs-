const Mongoose = require("mongoose");
const schema = Mongoose.Schema;
const Product = require('./product');

const UserSchema = new schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart:{
        items: [
            {
                productId: {
                    type: schema.Types.ObjectId,
                    ref: 'Product', // here this is use in releation ship
                    required: true
                },
                quantity:{
                    type: Number,
                    required: true
                }
            }
        ]
    }
})

UserSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
  
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
  };

  UserSchema.methods.getCart = function() {
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    return Product
      .find({ _id: {$in: productIds}}) //$in this to retrieve any data contain in id any data from this array
      .then(products => { 
        //console.log(products);                 
        return products.map((p, index) => {    
          //console.log({...p._doc});            
          return {
            ...p._doc ,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity            
          };
        });
      });
  }

  UserSchema.methods.deleteItemFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
  }

  UserSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
  };
  
  UserSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
  };

module.exports = Mongoose.model('User',UserSchema );