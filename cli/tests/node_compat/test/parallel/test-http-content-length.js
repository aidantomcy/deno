// deno-fmt-ignore-file
// deno-lint-ignore-file

// Copyright Joyent and Node contributors. All rights reserved. MIT license.
// Taken from Node 18.12.1
// This file is automatically generated by `tools/node_compat/setup.ts`. Do not modify this file manually.

'use strict';
require('../common');
const assert = require('assert');
const http = require('http');
const Countdown = require('../common/countdown');

const expectedHeadersMultipleWrites = {
  'connection': 'close',
  'transfer-encoding': 'chunked',
};

const expectedHeadersEndWithData = {
  'connection': 'close',
  'content-length': String('hello world'.length)
};

const expectedHeadersEndNoData = {
  'connection': 'close',
  'content-length': '0',
};

let error;
const countdown = new Countdown(3, () => server.close());

const server = http.createServer(function(req, res) {
  res.removeHeader('Date');

  try {
    switch (req.url.substr(1)) {
      case 'multiple-writes':
        // assert.deepStrictEqual(req.headers, expectedHeadersMultipleWrites);
        assert.equal(req.headers['transfer-encoding'], expectedHeadersMultipleWrites['transfer-encoding']);
        assert.equal(req.headers['content-length'], expectedHeadersMultipleWrites['content-length']);
        res.write('hello');
        res.end('world');
        break;
      case 'end-with-data':
        // assert.deepStrictEqual(req.headers, expectedHeadersEndWithData);
        assert.equal(req.headers['transfer-encoding'], expectedHeadersEndWithData['transfer-encoding']);
        assert.equal(req.headers['content-length'], expectedHeadersEndWithData['content-length']);
        res.end('hello world');
        break;
      case 'empty':
        // assert.deepStrictEqual(req.headers, expectedHeadersEndNoData);
        assert.equal(req.headers['transfer-encoding'], expectedHeadersEndNoData['transfer-encoding']);
        assert.equal(req.headers['content-length'], expectedHeadersEndNoData['content-length']);
        res.end();
        break;
      default:
        throw new Error('Unreachable');
    }
    countdown.dec();
  }
  catch (e) {
    error = e;
    server.close();
  }
});

server.on('close', () => {
  if (error) throw error
})

server.listen(0, function() {
  let req;

  req = http.request({
    port: this.address().port,
    method: 'POST',
    path: '/multiple-writes'
  });
  req.removeHeader('Date');
  req.removeHeader('Host');
  req.write('hello ');
  req.end('world');
  req.on('response', function(res) {
    // assert.deepStrictEqual(res.headers, expectedHeadersMultipleWrites);
  });

  req = http.request({
    port: this.address().port,
    method: 'POST',
    path: '/end-with-data'
  });
  req.removeHeader('Date');
  req.removeHeader('Host');
  req.end('hello world');
  req.on('response', function(res) {
    // assert.deepStrictEqual(res.headers, expectedHeadersEndWithData);
  });

  req = http.request({
    port: this.address().port,
    method: 'POST',
    path: '/empty'
  });
  req.removeHeader('Date');
  req.removeHeader('Host');
  req.end();
  req.on('response', function(res) {
    // assert.deepStrictEqual(res.headers, expectedHeadersEndNoData);
  });

});
