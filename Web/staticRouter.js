exports.StaticRouter = function (Config) {
    const express = require('express'),
        path = require('path'),
        Router  = express.Router();

    return {
        Routes: function () {
            return [
                Router.get('/img/:image', function (req, res) {
                    res.sendFile(path.join(__dirname + '/static/img/' + req.params.image));
                }),
                Router.get('/css/:css', function (req, res) {
                    res.sendFile(path.join(__dirname + '/static/css/' + req.params.css));
                }),
                Router.get('/js/:js', function (req, res) {
                    res.sendFile(path.join(__dirname + '/static/js/' + req.params.js));
                }),
            ];
        }
    };
};