"use strict";

const Article = require('../models/Article');
const GoogleFinance = require('google-finance');

class NewsCollector {

    static collectFull(symbol, callback) {
        console.log("Starting full collection...");
        NewsCollector.__fetch(1, true, (isCompleted) => {
            callback(isCompleted);
        });
    }

    static collectLatest(symbol, callback) {
        console.log("Getting latest news...");
        NewsCollector.__fetch(1, false, callback);
    }

    static __fetch(page = 1, isContinuous = false, callback) {
        console.log(`Fetching page ${page}`);
        GoogleFinance.companyNews({
            symbol: 'AMD',
            page_size: 25,
            page: page
        }, function (err, news) {
            if(err) {
                console.log("Error occured. Stopping", err);
                callback(false)
                return;
            }
            console.log(`Received ${news.length} results`)
            if(news.length > 0) {
                let promises = [];
                news.forEach((json) => {
                    let article = Article.fromJson(json);
                    console.log(`Queueing article from ${article.date}`);
                    promises.push(article.save())
                });
                console.log('Executing all saves...');
                Promise.all(promises).then(() => {
                    if(isContinuous) {
                        console.log('Getting next page');
                        NewsCollector.__fetch(page + 1, true, callback);
                    } else {
                        console.log("Finished");
                        callback(true);
                    }
                });
            } else {
                console.log("No results. Stopping");
                callback(true);
            }
        });
    }
}

module.exports = NewsCollector;