const http = require("https");
const fs = require('fs');
const RequestQueue = require('node-request-queue');


const pages = [0];
let rq = new RequestQueue(20);
const flavorItems = [];
function createHttpOptions(permissions, path, method, headers = null) {

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

function checkIfFlavorWasInsert(flavor, region, insert) {
    if (flavorItems.map((item) => {
        if (Object.keys(item)[0] == flavor){
            if(item[flavor].includes(region)){

            }else{
                item[flavor].push(region);
            }
        }
    }));
}

let resI = 0

rq.on('resolved', res => {
    const value = getLastValue();
    const json = parentHttpOptions(value);
    response = JSON.parse(res);
    console.log(value, response.Items.length);
    response.Items.map((item) => {
        if (item.serviceName == "Virtual Machines") {
            fs.appendFile("test.sql", `INSERT INTO usavingsFlavorPrices (spotPrice) values (${item.retailPrice}) where name=${item.armSkuName} and location=${item.location};`, function (err) {
                if (err) throw err;
                // console.log('Saved!');
            });
        }

    });
    rq.push(json);
}).on('rejected', err => {
    console.log(err);
}).on('completed', item => {
    console.log("completed", item);
})};