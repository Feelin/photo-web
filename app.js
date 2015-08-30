'use strict';
var get = require('./controllers/get');
var compress = require('koa-compress');
var logger = require('koa-logger');
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var app = module.exports = koa();



//Logger
app.use(logger());

// Serve static files
//app.use(serve(path.join(__dirname, 'public')));

// Compress
//app.use(compress());

var assetsHost = app.env == 'production' ? 'http://121.40.228.45' : 'http://localhost';

app.use(function *(next) {
    this.assetsHost = assetsHost;
    this.set('assetsHost',assetsHost);
    yield next;
});

app.use(route.get('/', get.home));

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000 in ' + app.env);
}
