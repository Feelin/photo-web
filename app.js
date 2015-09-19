'use strict';
var get = require('./controllers/get');
var post = require('./controllers/post');
var compress = require('koa-compress');
var logger = require('koa-logger');
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var app = module.exports = koa();
var config = require('./config');
var serve = require('koa-static-folder');
var bodyParser = require('koa-body-parser');


//Logger
app.use(logger());

// Serve static files
//app.use(serve(path.join(__dirname, 'public')));

// Compress
//app.use(compress());
app.use(bodyParser());
var assetsHost = app.env == 'production' ? config.ip: 'http://localhost';

app.use(function *(next) {
    this.assetsHost = assetsHost;
    this.set('assetsHost',assetsHost);
    yield next;
});

app.use(serve('./public'));

app.use(route.get('/', get.home));
app.use(route.get('/admin', get.admin));
app.use(route.get('/aboutus', get.aboutus));
app.use(route.get('/save', get.save));
app.use(route.get('/upload', get.upload));

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000 in ' + app.env);
}
