"use strict";

const Model = require('../db/Model');

class Snapshot extends Model {

    static get table() {
        return 'snapshots';
    }

    constructor() {
        super();

        this.id = 0;
        this.symbol = '';
        this.price = 0;
        this.volume = 0;
        this.timestamp = new Date();
    }
}

module.exports = Snapshot;