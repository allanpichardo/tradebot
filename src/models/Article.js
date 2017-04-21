"use strict";

const Model = require('../db/Model');

class Article extends Model {

    static get table() {
        return 'articles';
    }

    constructor() {
        super();

        this.id = 0;
        this.guid = '';
        this.symbol = "";
        this.title = '';
        this.description = '';
        this.summary = '';
        this.date = new Date();
        this.link = '';
    }
}

module.exports = Article;