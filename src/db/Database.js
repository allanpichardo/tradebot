"use strict";

let config = require('../../config.json');
let knex = require('knex');

class Database {
    constructor() {
        if(!Database.instance) {
            knex = knex({
                client: config.db_client,
                connection: {
                    host : config.db_host,
                    user : config.db_user,
                    password : config.db_password,
                    database : config.db_database,
                    port : config.db_port
                }
            });
            Database.instance = this;
        }

        return Database.instance;
    }

    get connection() {
        return knex;
    }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;