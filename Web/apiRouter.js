const Joi = require('joi');
const Router = require('express').Router();

exports.apiRouter = function (Config, makeSlug) {
    const Schema = Joi.object({
        url: Joi.string().uri().required(),
        slug: Joi.string().min((parseInt(Config.WebApp.SlugLength) + 1)).max(Config.WebApp.MaxSlugLength).pattern(/^[A-Za-z0-9._-]+$/, {'name': 'slug'}),
        mail: Joi.string().email()
    });

    return {
        Routes: function (DatabaseConnection, _TMP) {
            return [
                // New API Route
                Router.post('/new', async function (req, res, next) {
                    try {
                        const Request = await Schema.validateAsync(req.body);
                        let responseObject = {
                            "Status": 200,
                            "Message": 'De url is verkleind. 😁',
                            'Version': Config.Versions.API
                        };

                        DatabaseConnection.query('SELECT `slug`, `url` FROM `shorts` WHERE `url` = \'' + req.body.url + '\'', function (err, rows, fields) {
                            if (err) { next(err) } else {
                                if (rows && rows.length >= 1) {
                                    responseObject.Response = {
                                        newUrl: req.protocol + '://' + req.hostname + '/' + rows[0]['slug']
                                    };

                                    console.log("Returned existing slug <" + rows[0]['slug'] + "> with as url <" + req.body.url + ">");

                                    res.status(responseObject.Status).json(responseObject);
                                } else {
                                    let slug = (req.body.slug ? req.body.slug : makeSlug());
                                    DatabaseConnection.query('INSERT INTO `shorts`(`slug`, `url`) VALUES (\''+ slug + '\', \'' + req.body.url + '\')', function (err, rows, fields) {
                                        if (err) {
                                            if (err.code.toUpperCase() === 'ER_DUP_ENTRY') {
                                                if (req.body.slug) {
                                                    responseObject.Message = 'Helaas, er is een duplicaat opgetreden. Probeer een andere aangepaste waarde, of laat de aangepaste waarde leeg.';
                                                } else {
                                                    responseObject.Message = 'Helaas, er is een duplicaat opgetreden. Probeer het later opnieuw.';
                                                }
                                                responseObject.Status = 500;
                                                res.status(responseObject.Status).json(responseObject);
                                            } else {
                                                next(err);
                                            }
                                        } else {
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
                }),
                Router.get('/stats', async function (req, res, next) {
                    let responseObject = {
                        "Status": 200,
                        "Message": 'Current system stats',
                        'Version': Config.Versions.API,
                        "Response": _TMP
                    };
                    res.status(responseObject.Status).json(responseObject);
                })
            ];
        }
    };
};