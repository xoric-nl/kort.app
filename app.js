// Require Express
const express = require('express');
const app = express();

// Require Path
const path = require('path');

// MySQL Client Require
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin_kort',
    password: '8ir?R20l',
    database: 'admin_kort-app'
});

// Web App Settings
const port = 3000;
const slugLength = 6;

// Function to generate random slug
function makeSlug(length = slugLength) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Add slug to DB
function addToDB(slug, url) {
    console.log("Created slug <" + slug + "> with as url <" + url + ">");

    connection.query('INSERT INTO `shorts`(`slug`, `url`) VALUES (\''+ slug + '\', \'' + url + '\')', function (err, rows, fields) {
        if (err) {
            throw err
        }
    });
}

// Initiate Web App
app.use(express.json()) // for parsing application/json

// Default Route
app.get('/', function (req, res) {
    res.status(200).sendFile(path.join(__dirname + '/html/index.html'));
});

// Error Route
app.get('/error', function (req, res) {
    res.status(200).sendFile(path.join(__dirname + '/html/index.html'));
});

// New API Route
app.post('/api/new', function (req, res) {
    let responseObject = {
        "Status": 200,
        "Message": 'Ok',
        'Version': 1.0
    };
    let slug = makeSlug();

    addToDB(slug, req.body.url);

    let newUrl = 'https://' + req.hostname + '/' + slug;

    responseObject.Response = {
        newUrl: newUrl
    };
    res.status(responseObject.Status).json(responseObject);
})

// Open Slug
// optional add ([\\w]{' + slugLength + '})
app.get('/:slug', function(req, res) {
    connection.query('SELECT `url` FROM `shorts` WHERE `slug` = \'' + req.params.slug + '\'', function (err, rows, fields) {
        if (err) {
            throw err
        }

        if (rows.length === 1) {
            res.redirect(rows[0].url);
        } else {
            res.redirect('/error');
        }
    });
});

// Start Web App
app.listen(port, () => console.log(`App running on http://localhost:${port}`));