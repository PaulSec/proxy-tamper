var proxy = require('./lib/proxy-tamper').start({port: 8080});

// Tampering all the websites (they all should have a dot '.')
proxy.tamper(/\./, function (request) {
  console.log('tampering ' + request.url);

  // gzip encoding is not supported when tampering the body
  delete request.headers['accept-encoding'];

  request.onResponse(function (response) {
    // tamper the body by replacing Google with "Orange"
    response.body = response.body.replace(/Google/g, 'Orange');

    // complete the response
    response.complete();
  });
});
