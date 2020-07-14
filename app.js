// Require Express
const express = require('express');
const app = express();

// Require Middlewares
const middlewares = require('./middlewares');

// Require Path
const path = require('path');

// MySQL Client Require
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: process.env.HOST || 'localhost',
    user: process.env.USERNAME || 'admin_kort',
    password: process.env.PASSWORD || (process.env.PASSWORD === '' ? '' : '8ir?R20l'),
    database: process.env.DATABASE || 'admin_kort-app'
});

// Web App Settings
const port =  process.env.PORT || 3000;
const slugLength =  process.env.SLUGLENGTH || 6;

// Function to generate random slug
function makeSlug(length = slugLength) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Initiate Web App
app.use(express.json()); // for parsing application/json

// Default Route
app.get('/', function (req, res, next) {
    res.status(200).sendFile(path.join(__dirname + '/html/index.html'));
});

// Error Route
app.get('/error', function (req, res, next) {
    res.status(200).sendFile(path.join(__dirname + '/html/index.html'));
});

// New API Route
app.post('/api/new', function (req, res, next) {
    try {
        let responseObject = {
            "Status": 200,
            "Message": 'Ok',
            'Version': 1.0
        };

        connection.query('SELECT `slug`, `url` FROM `shorts` WHERE `url` = \'' + req.body.url + '\'', function (err, rows, fields) {
            if (rows.length >= 1) {
                responseObject.Response = {
                    newUrl: 'https://' + req.hostname + '/' + rows[0]['slug']
                };

                console.log("Returned existing slug <" + rows[0]['slug'] + "> with as url <" + req.body.url + ">");

                res.status(responseObject.Status).json(responseObject);
            } else {
                let slug = makeSlug();
                connection.query('INSERT INTO `shorts`(`slug`, `url`) VALUES (\''+ slug + '\', \'' + req.body.url + '\')', function (err, rows, fields) {
                    responseObject.Response = {
                        newUrl: 'https://' + req.hostname + '/' + slug
                    };

                    console.log("Created slug <" + slug + "> with as url <" + req.body.url + ">");

                    res.status(responseObject.Status).json(responseObject);
                });
            }
        });
    } catch (err) {
        next(err);
    }
});

// Open Slug
// optional add ([\\w]{' + slugLength + '})
app.get('/:slug', function(req, res, next) {
    try {
        connection.query('SELECT `url` FROM `shorts` WHERE `slug` = \'' + req.params.slug + '\'', function (err, rows, fields) {
            if (err) { next(err) } else {
                if (rows.length === 1) {
                    res.redirect(rows[0].url);
                } else {
                    next(Error('De gebruikte URL is niet langer beschikbaar.'));
                }
            }
        });
    } catch (err) {
        next(err);
    }
});

app.get('/img/:image', function (req, res) {
    res.sendFile(path.join(__dirname + '/img/' + req.params.image));
});

// Error Handling
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// Start Web App
app.listen(port, () => console.log(`App running on http://localhost:${port}`));