exports.apiRouter = function (Config, makeSlug) {
    const Router = require('express').Router();

    return {
        Routes: function (DatabaseConnection) {
            return [
                // New API Route
                Router.post('/new', function (req, res, next) {
                    try {
                        if (req.body.url) {
                            let responseObject = {
                                "Status": 200,
                                "Message": 'De url is verkleind. 😁',
                                'Version': Config.Versions.API
                            };

                            DatabaseConnection.query('SELECT `slug`, `url` FROM `shorts` WHERE `url` = \'' + req.body.url + '\'', function (err, rows, fields) {
                                if (err) { next(err) } else {
                                    if (rows && rows.length >= 1) {
                                        responseObject.Response = {
                                            newUrl: 'https://' + req.hostname + '/' + rows[0]['slug']
                                        };

                                        console.log("Returned existing slug <" + rows[0]['slug'] + "> with as url <" + req.body.url + ">");

                                        res.status(responseObject.Status).json(responseObject);
                                    } else {
                                        let slug = makeSlug();
                                        DatabaseConnection.query('INSERT INTO `shorts`(`slug`, `url`) VALUES (\''+ slug + '\', \'' + req.body.url + '\')', function (err, rows, fields) {
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
                        } else {
                            console.log(req.body);
                            throw new Error('URL is een verplicht veld.');
                        }
                    } catch (err) {
                        next(err);
                    }
                })
            ]
        }
    };
};