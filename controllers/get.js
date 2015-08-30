'use strict';
var views = require('co-views');
var parse = require('co-body');


var render = views(__dirname + '/../views', {
  map: { html: 'swig' },
  cache:false
});


module.exports.home = function *home() {
  this.body = yield render('index',{'assetsHost':this.assetsHost});
};

