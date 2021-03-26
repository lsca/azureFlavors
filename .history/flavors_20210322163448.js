const http = require("https");

const httpsOptions = createHttpOptions({publicIp: 'prices.azure.com', port: '443'}, '/api/retail/prices?$filter=serviceName%20eq%20%27Virtual%20Machines%27', 'GET');
const request = httpRequest(httpsOptions);
 
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
    console.log(request)
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
                    if (data instanceof Object) {
                        response = JSON.parse(data);
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