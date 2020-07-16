const express = require('express'),
    mysql = require('mysql'),
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }),
    router  = express.Router();

// New API Route
router.post('/new', function (req, res, next) {
    try {
        let responseObject = {
            "Status": 200,
            "Message": 'Ok',
            'Version': 1.0
        };

        throw Error('Testing');
        connection.query('SELECT `slug`, `url` FROM `shorts` WHERE `url` = \'' + req.body.url + '\'', function (err, rows, fields) {
            if (err) { next(err) } else {
                if (rows && rows.length >= 1) {
                    responseObject.Response = {
                        newUrl: 'https://' + req.hostname + '/' + rows[0]['slug']
                    };

                    console.log("Returned existing slug <" + rows[0]['slug'] + "> with as url <" + req.body.url + ">");

                    res.status(responseObject.Status).json(responseObject);
                } else {
                    let slug = makeSlug();
                    connection.query('INSERT INTO `shorts`(`slug`, `url`) VALUES (\''+ slug + '\', \'' + req.body.url + '\')', function (err, rows, fields) {
                        if (err) { next(err) } else {
                            responseObject.Response = {
                                newUrl: 'https://' + req.hostname + '/' + slug
                            };

                            console.log("Created slug <" + slug + "> with as url <" + req.body.url + ">");

                            res.status(responseObject.Status).json(responseObject);
                        }
                    });
                }
            }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;