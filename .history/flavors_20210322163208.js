const http = require("https");
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