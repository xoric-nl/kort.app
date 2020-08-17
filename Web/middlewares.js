exports.Middlewares = function (Config) {
  let Logger = require('./logger').Logger(Config);
  let responseObject = {
    "Status": 200,
    "Message": 'Ok',
    'Version': Config.Versions.API
  };

  return {
    notFound: function (req, res, next) {
      res.status(404);
      const error = new Error(`Not Found - ${req.originalUrl}`);
      next(error);
    },
    errorHandler: function (err, req, res, next) {
      if (req.originalUrl.includes('api')) {
        responseObject.Status = res.statusCode !== 200 ? res.statusCode : 500;
        responseObject.Message  = err.message;
        responseObject.Response = err.response ? err.response.data : null;
        if (process.env.NODE_ENV != 'production') {
          responseObject.Stack = err.stack;
        }

        res.status(responseObject.Status).json(responseObject);
      } else {
        res.redirect(`/?message=${encodeURIComponent(err.message)}`);
      }

      Logger.error('error', err.stack);
    }
  };
};