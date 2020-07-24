const express = require('express'),
    path = require('path'),
    router  = express.Router();

router.get('/img/:image', function (req, res) {
    res.sendFile(path.join(__dirname + '/img/' + req.params.image));
});

router.get('/css/:css', function (req, res) {
    res.sendFile(path.join(__dirname + '/css/' + req.params.css));
});

router.get('/js/:js', function (req, res) {
    res.sendFile(path.join(__dirname + '/js/' + req.params.js));
});

module.exports = router;