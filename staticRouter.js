const express = require('express'),
    path = require('path'),
    router  = express.Router();

router.get('/img/:image', function (req, res) {
    res.sendFile(path.join(__dirname + '/img/' + req.params.image));
});

module.exports = router;