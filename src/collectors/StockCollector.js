"use strict";

const YahooFinanceAPI = require('./YahooFinanceApi');
const Snapshot = require('../models/Snapshot');

let api;

class StockCollector {

    static get YAHOO_CLIENT_ID() {
        return 'dj0yJmk9VXNwOWg3R3NvRDkyJmQ9WVdrOU4xTlFhM1JVTlRRbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wYw--';
    }

    static get YAHOO_SECRET() {
        return 'b30f4ff5e4572a60ee4213df2eef696da6726fce';
    }

    static get yahooApi() {
        if(!api) {
            api = new YahooFinanceAPI({
                key: StockCollector.YAHOO_CLIENT_ID,
                secret: StockCollector.YAHOO_SECRET
            });
        }
        return api;
    }

    static collectDayHistory(symbol, callback) {
        console.log(`Collecting day snapshots for ${new Date().toDateString()}`);
        StockCollector.yahooApi.getIntradayChartData(symbol)
            .then((data) => {
                let quotes = data.query.results.quotes.quote['data-series'].series.p;
                let savePromises = [];
                for(let i = 0; i < quotes.length; i++) {
                    let snap = quotes[i];
                    let millis = parseInt(snap['ref'] + '000');
                    let timestamp = new Date(millis);
                    let snapshot = new Snapshot();

                    snapshot.price = parseFloat(snap.v[0]);
                    snapshot.symbol = symbol;
                    snapshot.timestamp = timestamp.toISOString();
                    snapshot.volume = snap.v[4];

                    console.log(`Queing snapshot for ${timestamp.toTimeString()}`);
                    savePromises.push(snapshot.save());
                }
                console.log('Executing saves...');
                Promise.all(savePromises).then(() => {
                    console.log('Finished');
                    callback(true);
                }).catch((err) => {
                    console.log("Error occured", err);
                    callback(false);
                });

            }).catch((err) => {
                console.log("Error occured", err);
                callback(false);
        })
    }
}

module.exports = StockCollector;