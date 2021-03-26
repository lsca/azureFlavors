const fs = require('fs');
const RequestQueue = require('node-request-queue');
const pages = [0];
const rq = new RequestQueue(20);
const flavorItems = [];

function getLastValue() {
    const value = pages[pages.length - 1];
    pages.push(value + 100);
    return value;
}

let i = 0;
while (i < 20) {
    i++
    const value = getLastValue();
    const json = parentHttpOptions(value);
    rq.push(json);
}

function parentHttpOptions(value) {
    const json = {
        uri: `http://prices.azure.com/api/retail/prices?$filter=serviceName%20eq%20%27Virtual%20Machines%27&$skip=${value}`,
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        body: ''
    }
    return json;
}

let resI = 0;

rq.on('resolved', res => {
    const value = getLastValue();
    const json = parentHttpOptions(value);
    response = JSON.parse(res);
    console.log(value * response.Items.length);
    response.Items.map((item) => {
        if (item.serviceName == "Virtual Machines") {
            console.log(item);
            // fs.appendFile("test.sql", `INSERT INTO usavingsFlavorPrices (spotPrice) values (${item.retailPrice}) where name=${item.armSkuName} and location=${item.location};`, function (err) {
            //     if (err) throw err;
            //     // console.log('Saved!');
            // });
        }
    });
    rq.push(json);
}).on('rejected', err => {
    console.log(err);
}).on('completed', item => {
    console.log("completed", item);
});