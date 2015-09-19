'use strict';
var views = require('co-views');
var parse = require('co-body');
var config = require('../config');
var fs = require('fs');
var jsdom = require('jsdom');
var q = require('q');
var request = require('request');
var bodyParser = require('koa-body-parser');


var render = views(__dirname + '/../views', {
  map: { html: 'swig' },
  cache:false
});


module.exports.save = function *save() {
  var data = this.request.body;
  var deferred = q.defer();
  var assetsHost = this.assetsHost;

  request.post('http://121.40.228.45:8080/wedding/wedding/api/album/save', {form:{
      moduleId:this.request.body.moduleId,
      title:this.request.body.title,
      description:this.request.body.description
    }},function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var res = render('upload',{
                  'assetsHost':assetsHost,
                  "id":JSON.parse(body).result.id,
                  "moduleId":data.moduleId
                });

      deferred.resolve(res);
    }
  });
  this.body = yield deferred.promise;
};

















