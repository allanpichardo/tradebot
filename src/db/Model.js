"use strict";

const Database = require('./Database');

class Model {

    static get table() {
        return '';
    }

    static get primaryKey() {
        return 'id';
    }

    constructor() {

    }

    static fromJson(json) {
        let instance = new this();
        for(let key in json) {
            if(json.hasOwnProperty(key)) {
                instance[key] = json[key];
            }
        }
        return instance;
    }

    static fromId(id) {
        let table = this.table;
        let primarykey = this.primaryKey;

        return new Promise((resolve, reject) => {
            Database.connection(table).where(primarykey, id).select().then((results) => {
                if(results.length > 0) {
                    let json = results[0];
                    resolve(this.fromJson(json));
                } else {
                    reject(new Error("Record not found."));
                }
            });
        });
    }

    static search(parameters) {
        let table = this.table;
        return new Promise((resolve, reject) => {
            Database.connection(table).where(parameters).select().then((results) => {
                let models = [];
                for(let i = 0; i < results.length; ++i) {
                    let model = results[0];
                    if(model[this.primaryKey] === 0) {
                        reject(new Error("There was a problem parsing the record."));
                    }
                    models.push(this.fromJson(model));
                }
                resolve(models);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    save(isUpdate = false) {
        let table = this.constructor.table;
        let primaryKey = this.constructor.primaryKey;

        if(isUpdate) {
            //todo: update
        } else {
            this[primaryKey] = undefined;

            return new Promise((resolve, reject) => {
                let insert = Database.connection(table).insert(this);
                let update = Database.connection(table).update(this);
                let query = `${insert.toString()} on duplicate key update ${update.toString().replace(/^update ([`"])[^\1]+\1 set/i, '')}`;
                Database.connection.raw(query).then(() => {
                    resolve();
                }).catch((error) => {
                    reject(error);
                });
            });
        }
    }

    destroy() {
        //todo: implement delete
        let table = this.constructor.table;
        let primaryKey = this.constructor.primaryKey;
        let id = this[primaryKey];
        return new Promise((resolve, reject) => {
            Database.connection(table).where(primaryKey, id).del().then((affected) => {
                if(affected !== 0) {
                    resolve(affected);
                } else {
                    reject(new Error("Could not delete record with ID: " + id));
                }
            }).then((error) => {
                reject(error);
            });
        });
    }

}

module.exports = Model;