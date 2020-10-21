const uri = process.env.MONGO_URI;
const MongoClient = require ('mongodb').MongoClient;
const DB_NAME  = 'bug-tracker';

module.exports = () => {
    const count = (collectionName) => {
        return new Promise ((resolve, reject) => {
            MongoClient.connect(uri, {useNewUrlParser: true}, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                
                collection.count({}, (err, docs) => {
                    resolve(docs);
                    client.close(); 
                });
            });    
        });
    };

    
    const get = (collectionName) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, {useNewUrlParser: true}, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.find({}).toArray((err, docs) => {
                    resolve(docs);
                    client.close();
                });
            });
        });
    };

    const add = (collectionName, item) => {
        return new Promise ((resolve, reject) => {
            MongoClient.connect(uri, {useNewUrlParser: true}, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                
                collection.insertOne(item, (err, result) => {
                    resolve(result);
                })
                
            });
        });
    };

    return {
        get,
        add,
        count
    };
};