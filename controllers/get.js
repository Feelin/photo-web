'use strict';
var views = require('co-views');
var parse = require('co-body');
var config = require('../config');
var co = require("co");
var fs = require('fs');
var jsdom = require('jsdom');
var q = require('q');
var request = require('request');

var render = views(__dirname + '/../views', {
  map: { html: 'swig' },
  cache:false,
  layout: 'layout',
});


module.exports.home = function *home() {
  this.body = yield render('index',{'assetsHost':this.assetsHost});
};

module.exports.admin = function *admin() {
  var that = this;
  if(this.request.query.passwork == config.korwssap){

    var deferred = q.defer();
    var page_template = fs.readFileSync('views/index.html','utf-8');

    jsdom.env("http://121.40.228.45:3000/", [
      'http://cdn.bootcss.com/jquery/3.0.0-alpha1/jquery.min.js',
      {'assetsHost':this.assetsHost}
    ],
    function(errors, window) {
      var $ = window.$;
      // window.$("script").each(function(i,dom){
      //   console.log(dom.attr("src").replace("{{ assetsHost }}",this.assetsHost))
      //   dom.attr("src").replace("{{ assetsHost }}",this.assetsHost);
      // });
      $("a").each(function(i){
        var text = $(this).text();
        $(this).append("<input type='text' data-id='"+i+"' class='admin-input' placeholder='"+text+"'></input>");
      })
      $("body").append('<script type="text/javascript" src="public/scripts/admin.js"></script>')
      var output = '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml">' + window.$("html").html() + '</html>';
      deferred.resolve(output);

    });

    that.body = yield deferred.promise;
    //that.body = yield render("admin",{'assetsHost':this.assetsHost});




  }
  else{
    return false;
  }
};



module.exports.aboutus = function *aboutus() {
  this.body = yield render('aboutus',{'assetsHost':this.assetsHost});
};

module.exports.save = function *save() {
  if(this.request.query.passwork != config.korwssap){
    return false
  }
  this.body = yield render('save',{'assetsHost':this.assetsHost});
};

module.exports.upload = function *upload() {

  var deferred = q.defer();
  if(!this.request.query.moduleId){
    return false;
  }

  var promise = new Promise(function(resolve,reject){
    request.post('http://121.40.228.45:8080/wedding/wedding/api/album/getAlbums',  {form:{
      moduleId:this.request.query.moduleId,
      size:1
    }},function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      }
      else{
        reject(error);
      }
    });
  });

  co(function *(){
    console.log("!!!!")
    var data = yield Promise.resolve(promise);
    return data;
  }).then(function(value){
    console.log("@@@@@@")
    console.log(value)
  });
  //
  //request.post('http://121.40.228.45:8080/wedding/wedding/api/album/getAlbums',  {form:{
  //    moduleId:this.request.query.moduleId,
  //    size:1
  //  }},function (error, response, body) {
  //  if (!error && response.statusCode == 200) {
  //    deferred.resolve(body);
  //  }
  //});
  //
  //var data = yield deferred.promise;
  //data = JSON.parse(data).result[0];
  //console.log(data.id)
  //
  //var deferred2 = q.defer();
  //request.post('http://121.40.228.45:8080/wedding/wedding/api/album/getAlbumPictures',  {form:{
  //  albumId:data.id
  //}},function (error, response, body) {
  //  if (!error && response.statusCode == 200) {
  //    deferred2.resolve(body);
  //  }
  //});
  //
  //var data = yield deferred2.promise;
  //console.log(JSON.parse(data).result)
  //this.body = yield render('upload',{'assetsHost':this.assetsHost,data:JSON.parse(data).result[0]});
  this.body = yield render('upload',{'assetsHost':this.assetsHost});
};

















