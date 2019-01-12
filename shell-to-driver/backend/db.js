const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient;
const mongoDbUrl = 'mongodb+srv://juan:juan2019@cluster0-ycwj8.mongodb.net/shop?retryWrites=true';

let _db;

const initDb = callback => {
  if (_db) {
    console.log('Database is already initialize!');
    return callback(null, _db);
  }
  const client = new MongoClient(mongoDbUrl, { useNewUrlParser: true });
  client.connect(err => {
    if (err) {
      callback(err)
    } else {
      _db = client;
      callback(null, _db);
    }
  })
}

const getDb = () => {
  if (!_db) {
    throw Error('Database not initialized!')
  }
  return _db;
}

module.exports = {
  initDb,
  getDb
}