const _ = require('lodash');
const util = require('util');
const mongodb = require('mongodb');
const Promise = require('bluebird');
const MongoClient = mongodb.MongoClient;
const logger = require('./logger');


class MongoConnection {

    constructor(dbName, url) {
        let self = this;
        self.dbName = dbName;
        if (!url) {
            self.dbUrl = "mongodb+srv://cooladmin:welcome2RMS@cluster0-ctqyq.mongodb.net/test?retryWrites=true&w=majority";

            if (process.env.MONGO_HOST) {
                self.dbUrl = `mongodb://${process.env.MONGO_HOST}`;
                if (!self.dbUrl.endsWith(":27017")) {
                    self.dbUrl += ":27017";
                }
            }
        } else {
            self.dbUrl = url;
        }
    }

    connect() {
        let self = this;
        return new Promise((resolve, reject) => {
            let options = { useNewUrlParser: true };
            MongoClient.connect(self.dbUrl, options, function(err, db) {
                if (err) {
                    return reject(err);
                }
                self.dbo = db.db(self.dbName);
                resolve(self.dbo);
            });

        })

    }

    getDb() {
        let self = this;
        if (self.dbo) {
            return Promise.resolve(self.dbo);
        } else {
            return self.connect();
        }
    }

    insertData(collection, data, attempts = 0) {
        let self = this;
        if (attempts > 3) {
            return Promise.reject(new Error(`attempt to insert into ${collection} with data ${util.inspect(data)} failed after 3 attempts`));
        }
        return new Promise((resolve, reject) => {
            return self.getDb()
                .then(db => {
                    db.collection(collection)
                        .insert(data, (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(result);
                        });
                });
        })
            .catch(e => {
                if (attempts > 3) {
                    return Promise.reject(e);
                }
                return common.promiseWait(5000)
                    .then(() => {
                        return self.insertData(collection, data, attempts + 1);
                    });
            })
    }

    findData(collection, query, sort) {
        let self = this;
        sort = sort || {};
        return new Promise((resolve, reject) => {
            return self.getDb()
                .then(db => {
                    db.collection(collection)
                        .find(query)
                        .sort(sort)
                        .toArray((err, result) => {
                            if (err) {
                                return reject(err);
                            }

                            return resolve(result);

                        })
                })
        });
    }

    findAll(collection, sort) {
        let self = this;
        sort = sort || {};
        return new Promise((resolve, reject) => {
            return self.getDb()
                .then(db => {
                    db.collection(collection)
                        .find()
                        .sort(sort)
                        .toArray((err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(result);
                        })
                })
        });
    }

    aggregateData(collection, clauseArray) {
        let self = this;
        return new Promise((resolve, reject) => {
            return self.getDb()
                .then(db => {
                    db.collection(collection)
                        .aggregate(clauseArray)
                        .toArray((err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(result);
                        })
                })
        });

    }

    deleteData(collection, query) {
        let self = this;
        return new Promise((resolve, reject) => {
            return self.getDb()
                .then(db => {
                    db.collection(collection)
                        .deleteOne(query, (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            logger.debug(`Successfully deleted using query ${util.inspect(query)} from collection ${collection}`);
                            return resolve(result);
                        })
                });
        });
    }

    deleteManyData(collection, query) {
        let self = this;
        return new Promise((resolve, reject) => {
            return self.getDb()
                .then(db => {
                    db.collection(collection)
                        .deleteOne(query, (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            logger.debug(`Successfully deleted using query ${util.inspect(query)} from collection ${collection}`);
                            return resolve(result);
                        })
                });
        });
    }

    updateData(collection, findQuery, update) {
        let self = this;
        return new Promise((resolve, reject) => {
            return self.getDb()
                .then(db => {
                    db.collection(collection)
                        .updateOne(findQuery, update, (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(result);
                        });
                });
        });
    }
}

module.exports = MongoConnection;
