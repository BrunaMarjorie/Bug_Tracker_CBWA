const { ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI;
const MongoClient = require('mongodb').MongoClient;
const DB_NAME = 'bug-tracker';
const MONGO_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };

module.exports = () => {
    const count = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== count::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection(collectionName);
                    collection.countDocuments(query, (err, docs) => {
                        if (err) {
                            console.log("=== count::collection.countDocuments");
                            console.log(err);
                            return reject(err);
                        } else {
                            resolve(docs);
                            client.close();
                        }
                    });
                }
            });
        });
    };

    const get = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {          
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== get::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection(collectionName);
                    collection.find(query).toArray((err, docs) => {
                        if (err) {
                            console.log("=== get::collection.find");
                            console.log(err);
                            return reject(err);
                        } else {
                            resolve(docs);
                            client.close();
                        }
                    });
                }
            });
        });
    };

    const add = (collectionName, item) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== add::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection(collectionName);
                    collection.insertOne(item, (err, result) => {
                        if (err) {
                            console.log("=== add::collection.insertOne");
                            console.log(err);
                            return reject(err);
                        } else {
                            resolve(result);
                            client.close();
                        }
                    });
                }
            });
        });
    };

    const updateIssueStatus = (query = {}, issueNumber, status) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== updateIssueStatus::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection1 = db.collection('users');
                    const collection2 = db.collection('issues');
                    //find if user is an admin or not;
                    collection1.find(query).project({ '_id': 0, 'usertype': 1 }).toArray((err, docs) => {
                        if (err) {
                            console.log("=== updateIssueStatus::collection.find");
                            console.log(err);
                            return reject(err);
                        } else {
                            if (docs[0].usertype === "admin") {
                                //if an admin, update status;
                                collection2.updateOne({ 'issueNumber': issueNumber }, { $set: { 'status': status } }, (err, result) => {
                                    if (err) {
                                        console.log("=== updateIssueStatus::collection.updateOne");
                                        console.log(err);
                                        return reject(err);

                                    } else {
                                        resolve(result);
                                        client.close();
                                    }
                                });
                            } else { //response if not an admin;
                                console.log("Error: Not authorized.");
                                resolve(null);
                                client.close();
                            }
                        }
                    });
                }
            });
        });
    };

    //check issues due date and change their status if needed;
    const checkDueDate = () => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== find::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection('issues');
                    //collecting current date;
                    const currentDate = new Date();
                    collection.find({ 'dueDate': { $lte: currentDate } }).toArray((err, docs) => {
                        if (err) {
                            console.log("=== checkDueDate::collection.find");
                            console.log(err);
                            return reject(err);
                        } else {
                            var user = [];
                            for (i = 0; i < docs.length; i++) {
                                if (docs[i].status === 'open'){
                                    user.push(docs[i].issueNumber);
                                }
                            }
                            collection.updateMany({ 'dueDate': { $lte: currentDate } }, { $set: { 'status': 'closed' } }, (err, result) => {
                                if (err) {
                                    console.log("=== checkDueDate::collection.updateMany");
                                    console.log(err);
                                    return reject(err);
                                } else {
                                    console.log("status updated.");
                                    console.log(user);
                                    resolve(user);
                                    client.close();
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    const aggregate = (collectionName, pipeline = []) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== aggregate::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection(collectionName);
                    collection.aggregate(pipeline).toArray((err, docs) => {
                        if (err) {
                            console.log("=== aggregate::collection.aggregate");
                            console.log(err);
                            return reject(err);
                        } else {
                            resolve(docs);
                            client.close();
                        }
                    });
                }
            });
        });
    };

    //find any general item;
    const find = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== find::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection(collectionName);
                    collection.find(query).toArray((err, docs) => {
                        if (err) {
                            console.log("=== find::collection.find{query}");
                            console.log(err);
                            return reject(err);
                        } else {
                            if (docs.length === 0) {
                                resolve(null);
                                client.close();
                            } else {
                                resolve(docs[0]._id);
                                client.close();
                            }
                        }
                    });
                }
            });
        });
    };

    //find only for the users' keys;
    const findKeys = () => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== findKeys::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection('users');
                    collection.find({}).project({ 'key': 1, '_id': 0, 'email': 1 }).toArray((err, docs) => {
                        if (err) {
                            console.log("=== findKeys::collection.find");
                            console.log(err);
                            return reject(err);
                        } else {
                            if (docs == null) {
                                resolve(null);
                                client.close();
                            } else {
                                resolve(docs);
                                client.close();
                            }
                        }
                    });
                }
            });
        });
    };

    //create array of watchers;
    const usersWatchers = (query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== find::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection('watchers');
                    collection.find(query).toArray((err, docs) => {
                        if (err) {
                            console.log("=== sendEmail::collection.find{query}");
                            console.log(err);
                            return reject(err);
                        } else {
                            if (docs.length === 0) {
                                resolve(null);
                                client.close();
                            } else {
                                console.log(docs);
                                var user = [];
                                for (i = 0; i < docs.length; i++) {
                                    user.push(docs[i].author);
                                }
                                resolve(user);
                                client.close();
                            }
                        }
                    });
                }
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
        checkDueDate,
        usersWatchers,
    };
};