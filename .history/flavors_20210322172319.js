const http = require("https");
const fs = require('fs');

const httpsOptions = createHttpOptions({ publicIp: 'prices.azure.com', port: '443' }, '/api/retail/prices?$filter=serviceName%20eq%20%27Virtual%20Machines%27', 'GET');
const request = httpRequest(httpsOptions);
const flavorItems = [];
function createHttpOptions(permissions, path, method, headers = null) {
    const headersJson = {
        "Content-Type": "application/json",
    };

    if (headers != null) {
        headers.forEach(function (element) {
            headersJson[element[0]] = element[1];
        });
    }

    const request = {
        host: permissions.publicIp.trim(),
        path: path,
        port: permissions.port,
        method: method,
        headers: headersJson,
    };
    return request;
}

function httpRequest(httpOption, body = "") {
    return new Promise((resolve, reject) => {
        const request = http.request(httpOption, function (response) {
            let data = "";

            response.on("data", function (cbresponse) {
                data += cbresponse;
            });

            response.on("end", () => {
                try {
                    let response;
                    response = JSON.parse(data);
                    console.log(flavorItems.length);
                    response.Items.map((item) => {
                        if (item.skuName.indexOf('Spot') > -1) {
                            console.log(item.retailPrice);
                            fs.appendFile("test.sql", `INSERT INTO usavingsFlavorPrices (spotPrice) values (${item.retailPrice}) where name=${item.armSkuName} and location=${item.location};`, function (err) {
                                if (err) throw err;
                                // console.log('Saved!');
                            });
                        }
                    });
                    if (response.hasOwnProperty('NextPageLink')) {
                        const httpsOptions = createHttpOptions({ publicIp: 'prices.azure.com', port: '443' }, response.NextPageLink.split('https://prices.azure.com:443')[1], 'GET');
                        httpRequest(httpsOptions);

                    }
                    if (data instanceof Object) {
                    } else {
                        response = data;
                    }
                    resolve(response);
                } catch (err) {
                    console.log("ERR ====>  ", err);
                }
            });
        });

        if (body instanceof Object) {
            body = JSON.stringify(body);
        }
        request.write(body);
        request.end();
    })
}