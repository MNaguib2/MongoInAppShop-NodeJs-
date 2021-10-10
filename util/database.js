const Data = require('../Data');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
let _db;

const MongoConnect = (callback) => {
                                                                                    //here add name database
    MongoClient.connect(`mongodb+srv://mena:${Data.password}@cluster0.ovkbw.mongodb.net/${Data.nameDb}?retryWrites=true&w=majority`)
    .then(client => {
        console.log('Connected!')
        callback(client);
        _db = client.db()//you can add different name DataBase here by use  _db = client.db('<differrent name>')
    })
    .catch(err => console.log(err));
}

const getDb = () => {
    if (_db) {
      return _db;
    }
    throw 'No database found!';
  };
  
  exports.mongoConnect = MongoConnect;
  exports.getDb = getDb;
