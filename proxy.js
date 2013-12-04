var proxy = require('./lib/proxy-tamper').start({port: 8080});

// replace all instances of 'Apple' with 'Orange' in TechCrunch articles
proxy.tamper(/\//, function (request) {
  console.log('tampering ' + request.url);

  // gzip encoding is not supported when tampering the body
  delete request.headers['accept-encoding'];

  request.onResponse(function (response) {
    // tamper the body
    response.body = response.body.replace(/Google/g, 'Orange');

    // complete the response
    response.complete();
  });
});
