
/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});

app.get('/chat', function(req, res){
    res.sendfile(__dirname + '/chat.html');
});

exports.app = app;
