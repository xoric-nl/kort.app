// Read and configure .env
const dotenv = require("dotenv");
dotenv.config();

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
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Route Controller's
const staticRouter = require('./staticRouter');
const apiRouter    = require('./apiRouter');

// Web App Settings
const port =  process.env.PORT || 8000;
const slugLength =  process.env.SLUGLENGTH || 6;

// Initiate Web App
app.use(express.json()); // for parsing application/json

// Default Route
app.get('/', function (req, res, next) {
    res.status(200).sendFile(path.join(__dirname + '/html/index.html'));
});

// Static Files Route
app.use('/static', staticRouter);
app.use('/api', apiRouter);

// Robots txt
app.get('/robots.txt', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/robots.txt'));
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
                    next(Error('De gebruikte URL is niet langer beschikbaar. 😒'));
                }
            }
        });
    } catch (err) {
        next(err);
    }
});

// Error Handling
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// Start Web App
app.listen(port, () => console.log(`App running on http://localhost:${port}`));