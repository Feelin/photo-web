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
  var p1 = new Promise(function (resolve, reject) {
    request.post('http://121.40.228.45:8080/wedding/wedding/api/album/getAlbums', {
      form: {
        moduleId: 1,
        size: 3
      }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      }
      else {
        reject(error);
      }
    });
  });
  var p2 = new Promise(function (resolve, reject) {
    request.post('http://121.40.228.45:8080/wedding/wedding/api/album/getAlbums', {
      form: {
        moduleId: 3,
        size: 3
      }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      }
      else {
        reject(error);
      }
    });
  });
  var p3 = new Promise(function (resolve, reject) {
    request.post('http://121.40.228.45:8080/wedding/wedding/api/album/getAlbums', {
      form: {
        moduleId: 4,
        size: 3
      }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      }
      else {
        reject(error);
      }
    });
  });
  var data = yield [p1,p2,p3];
  data[0] = (JSON.parse(data[0]));
  data[1] = (JSON.parse(data[1]));
  data[2] = (JSON.parse(data[2]));
  console.log(data[0].result)
  this.body = yield render('index',{'assetsHost':this.assetsHost,data:data});
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

module.exports.upload = function *upload()
{

  if (!this.request.query.moduleId) {
    return false;
  }

  var req =  this.request.query;

  var data = {};
  if(req.id){
    data.id = req.id;
  }
  else{
    var p1 = new Promise(function (resolve, reject) {
      request.post('http://121.40.228.45:8080/wedding/wedding/api/album/getAlbums', {
        form: {
          moduleId: req.moduleId,
          size: 1
        }
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
        }
        else {
          reject(error);
        }
      });
    });
    data = JSON.parse(yield p1).result[0];
  }
console.log(data)
  var p2 = new Promise(function(resolve,reject){
    request.post('http://121.40.228.45:8080/wedding/wedding/api/pictures/getAlbumPictures',  {form:{
      albumId:data.id
    }},function (error, response, body) {
      if (!error && response.statusCode == 200) {

       resolve(body);
      }
      else{
        reject(error)
      }
    });
  });

  var picData =JSON.parse( yield p2).result;

  console.log(picData)

  this.body = yield render('upload',{
    'assetsHost':this.assetsHost,
    "data":data,
    "picData":picData
  });


};


module.exports.list = function *list() {
  if(this.request.query.passwork != config.korwssap){
    return false
  }
  var req = this.request.query;
  var p = new Promise(function(resolve,reject){
    request.post('http://121.40.228.45:8080/wedding/wedding/api/album/getAlbums',  {form:{
      moduleId:req.moduleId
    }},function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      }
      else{
        reject(error)
      }
    });
  });

  var data =  JSON.parse( yield p );
  console.log(data)
  this.body = yield render("albums",{list:data.result,moduleId:req.moduleId})
};


module.exports.piclist = function *piclist() {

  var req = this.request.query;
  var p = new Promise(function(resolve,reject){
    request.post('http://121.40.228.45:8080/wedding/wedding/api/pictures/getAlbumPictures',  {form:{
      albumId:req.albumId
    }},function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      }
      else{
        reject(error)
      }
    });
  });

  var data = JSON.parse(yield p);
  console.log(data)
  this.body = yield render("piclist",{'assetsHost':this.assetsHost,pics:data.result})
};

















