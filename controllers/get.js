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
   var p4 = new Promise(function(resolve,reject){
    request.post('http://121.40.228.45:8080/wedding/wedding/api/pictures/getAlbumPictures',  {form:{
      albumId:-1
    }},function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      }
      else{
        reject(error)
      }
    });
  });
  var data = yield [p1,p2,p3,p4];
  data[0] = (JSON.parse(data[0]));
  data[1] = (JSON.parse(data[1]));
  data[2] = (JSON.parse(data[2]));
  data[3] = (JSON.parse(data[3]));
  this.body = yield render('index',{'assetsHost':this.assetsHost,data:data});
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
  this.body = yield render("piclist",{'assetsHost':this.assetsHost,pics:data.result})
};


module.exports.aboutus = function *aboutus() {
  this.body = yield render('aboutus',{'assetsHost':this.assetsHost});
};

module.exports.wenhua = function *wenhua() {
  this.body = yield render('wenhua',{'assetsHost':this.assetsHost});
};

module.exports.albumList = function *albumList() {
  var req = this.request.query;
  var p = new Promise(function(resolve,reject){
    request.post('http://121.40.228.45:8080/wedding/wedding/api/album/getAlbums',  {form:{
      moduleId:req.id
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
  this.body = yield render('albumList',{'assetsHost':this.assetsHost,"data":data.result});
};


module.exports.priceList = function *priceList() {
  var p = new Promise(function(resolve,reject){
    request.post('http://121.40.228.45:8080/wedding/wedding/api/pictures/getAlbumPictures',  {form:{
      albumId:-1
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
  this.body = yield render('priceList',{'assetsHost':this.assetsHost,"data":data.result});
};
//////////////admin

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
  this.body = yield render("albums",{list:data.result,moduleId:req.moduleId})
};


module.exports.price = function *price() {
  if(this.request.query.passwork != config.korwssap){
    return false
  }
  var p = new Promise(function(resolve,reject){
    request.post('http://121.40.228.45:8080/wedding/wedding/api/pictures/getAlbumPictures',  {form:{
      albumId:-1
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
  this.body = yield render("price",{'assetsHost':this.assetsHost,pics:data.result})
};















