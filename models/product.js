const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(price, title, description, imageUrl) {
      this.title = title;
      this.price = price;
      this.description = description;
      this.imageUrl = imageUrl;
    }    
    save() {   
      const db = getDb(); 
        return  db.collection('products').insertOne(this);
 }

    static fetchAll(){
      const db = getDb();
      return db.collection('products').find().toArray()
      .then(products => {
        return products;
      })
      .catch(err => console.log(err));
    }
    static findById(prodId) {
      const db = getDb();
      return db
        .collection('products')
        .find({ _id: new mongodb.ObjectId(prodId)})
        .next()
        .then(product => {
          return product;
        })
        .catch(err => {
          console.log(err);
        });
    }
    Update(prodId){
      const db = getDb(); 
      return db.collection('products').updateOne({_id : new mongodb.ObjectId(prodId)}, {$set : this});
    }
}

module.exports = Product;