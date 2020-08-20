// Read and configure .env
const dotenv = require("dotenv");
dotenv.config();

const Version = {
    Web: '2.7',
    API: '1.5'
};

// App Config Object
const Config = {
    Database: {
        Host: process.env.DB_HOST,
        Username: process.env.DB_USERNAME,
        Password: process.env.DB_PASSWORD,
        Name: process.env.DB_NAME
    },
    WebApp: {
        Port: process.env.PORT || 8000,
        SlugLength: process.env.SLUGLENGTH || 6,
        MaxSlugLength: process.env.MAX_LENGTH || 32
    },
    Cron: {
        time: '0 */30 * * * *'
    },
    TimeZone: 'Europe/Amsterdam',
    Versions: Version
};

let _TMP = {
    RunInfo: {
        time: '',
        zone: Config.TimeZone
    },
    LastRemoved: {
        amount: 0,
    },
    TotalShorted: {
        amount: 0
    }
};

// Require Express
const express = require('express');
const app = express();

// Require Middlewares
const Middlewares = require('./middlewares').Middlewares(Config);

// Require Logger
const Logger = require('./logger').Logger(Config);

// Require Path
const path = require('path');

// MySQL Client Require
const Mysql = require('mysql')
const DatabaseConnection = Mysql.createConnection({
    host: Config.Database.Host,
    user: Config.Database.Username,
    password: Config.Database.Password,
    database: Config.Database.Name
});

// Functions
// makeSlug to generate random slug
function makeSlug(length = Config.WebApp.SlugLength) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Cron's
const CronJobs = require('./CronJobs').Jobs(Config, DatabaseConnection, _TMP);
CronJobs.RemoveOldData.start();
CronJobs.GetShortedCount.start();

// Route Controller's
const staticRouter = require('./staticRouter').StaticRouter(Config);
const apiRouter    = require('./apiRouter').apiRouter(Config, makeSlug);

// Initiate Web App
app.use(express.json()); // for parsing application/json

// Default Route
app.get('/', function (req, res, next) {
    res.status(200).render(path.join(__dirname + '/html/index.ejs'), {
        Version: Config.Versions,
        WebApp: Config.WebApp,
        Stats: _TMP
    });
});

// Static Files Route
app.use('/static', staticRouter.Routes());
app.use('/api', apiRouter.Routes(DatabaseConnection, _TMP));

// Robots txt
app.get('/robots.txt', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/robots.txt'));
});

// WebManifest
app.get('/manifest.webmanifest', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/manifest.webmanifest'));
});

// Serviceworker
app.get('/serviceWorker.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/js/serviceWorker.js'));
});

// Favicon.ico
app.get('/favicon.ico', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/img/favicon.png'));
});

// Open Slug
// optional add ([\\w]{' + slugLength + '})
app.get('/:slug', function(req, res, next) {
    try {
        DatabaseConnection.query('SELECT `url` FROM `shorts` WHERE `slug` = \'' + req.params.slug + '\'', function (err, rows, fields) {
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
app.use(Middlewares.notFound);
app.use(Middlewares.errorHandler);

// Start Web App
app.listen(Config.WebApp.Port, () => Logger.info("web", `App running on http://localhost:${Config.WebApp.Port}`));