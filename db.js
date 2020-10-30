const { ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI;
const MongoClient = require ('mongodb').MongoClient;
const DB_NAME  = 'bug-tracker';
const MONGO_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true};

module.exports = () => {
    const count = (collectionName, query = {}) => {
        return new Promise ((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);                    
                collection.countDocuments(query, (err, docs) => {
                    resolve(docs);
                    client.close(); 
                });             
            });    
        });
    };
    
    const get = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.find(query).toArray((err, docs) => {
                    resolve(docs);
                    client.close();
                });
            });
        });
    };
    
    const add = (collectionName, item) => {
        return new Promise ((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.insertOne(item, (err, result) => {
                    resolve(result);
                    client.close();
                })            
            });
        });
    };
    
    const updateIssueStatus = (issueNumber, status) => {
        return new Promise ((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection('issues');
                collection.updateOne({'issueNumber': issueNumber}, {$set: {'status': status}}, (err, result) => {
                    resolve(result);
                    client.close();
                });            
            });
        });
    };
    
    const aggregate = (collectionName, pipeline = []) => {
        return new Promise ((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.aggregate(pipeline).toArray((err, docs) => {
                    if(err){
                        console.log("-----aggregate ERROR-----");
                        console.log(err);
                    }else {
                    resolve(docs);
                    client.close();
                    }
                })            
            });
        });
    };
    
    //find any general item;
    const find = (collectionName, query = {}) => {
        return new Promise ((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);                    
                collection.find(query).toArray((err, docs) => {
                    console.log(docs);
                    if (docs.length === 0){
                        resolve(null);
                        client.close();
                    } else{   
                        resolve(docs[0]._id);
                        client.close(); 
                    }
                });             
            });    
        });
    };
    
    //find only for the users' keys;
    const findKeys = () => {
        return new Promise ((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection('users');                    
                collection.find({}).project({'key': 1, '_id': 0, 'email': 1}).toArray((err, docs) => {               
                    if (docs == null){
                        resolve(null);
                        client.close();
                    } else{   
                        resolve(docs);
                        client.close(); 
                    }
                });             
            });    
        });
    };
    
    return {
        get,
        add,
        count,
        find,
        findKeys,
        aggregate,
        updateIssueStatus, 
    };
};