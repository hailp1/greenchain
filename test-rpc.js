const https = require('https');

const data = JSON.stringify({
  jsonrpc: '2.0',
  method: 'eth_blockNumber',
  params: [],
  id: 1
});

const options = {
  hostname: 'rpc2.ammedtech.com',
  port: 443,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => {
    body += d;
  });
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      console.log(json.result || 'FAIL');
    } catch(e) {
      console.log('FAIL');
    }
  });
});

req.on('error', error => {
  console.log('FAIL');
});

req.write(data);
req.end();
