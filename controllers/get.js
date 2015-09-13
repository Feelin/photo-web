'use strict';
var views = require('co-views');
var parse = require('co-body');
var config = require('../config');
var fs = require('fs');
var jsdom = require('jsdom');
var q = require('q');

var render = views(__dirname + '/../views', {
  map: { html: 'swig' },
  cache:false
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
      $("a").each(function(){
        $(this).append("<input type='text' class='admin-input'></input>");
      })
      var output = '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml">' + window.$("html").html() + '</html>';
      console.log("there have been", window.$("a").length, "nodejs releases!");
      deferred.resolve(output);

    });

    that.body = yield deferred.promise;
    //that.body = yield render("admin",{'assetsHost':this.assetsHost});




  }
  else{
    return false;
  }
};
