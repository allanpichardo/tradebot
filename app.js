"use strict";

const NewsCollector = require('./src/collectors/NewsCollector');
const StockCollector = require('./src/collectors/StockCollector');

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " FUNCTION SYMBOL");
    process.exit(-1);
}

let func = process.argv[2];
let param = process.argv[3];

if(func === 'collect-all-news') {
    if(param) {
        NewsCollector.collectFull(param, (isComplete) => {
            console.log("Completed? ", isComplete);
            process.exit(isComplete ? 0 : -1);
        });
    } else {
        console.log("Missing stock symbol");
        process.exit(-1);
    }
} else if(func === 'collect-snapshots') {
    if(param) {
        StockCollector.collectDayHistory(param, (isComplete) => {
            console.log("Completed? ", isComplete);
            process.exit(isComplete ? 0 : -1);
        });
    } else {
        console.log("Missing interval");
        process.exit(-1);
    }
} else if(func === 'collect-latest-news') {
    if(param) {
        NewsCollector.collectLatest(param, (isComplete) => {
            console.log("Completed? ", isComplete);
            process.exit(isComplete ? 0 : -1);
        });
    } else {
        console.log("Missing stock symbol");
        process.exit(-1);
    }
}