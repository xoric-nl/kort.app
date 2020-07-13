function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(err, req, res, next) {
  if (req.originalUrl.includes('api')) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      response: err.response ? err.response.data : null,
    });
  } else {
    res.redirect(`/error?message=${encodeURIComponent(err.message)}`);
  }

  console.error(err.stack);
  
}

module.exports = {
  notFound,
  errorHandler
};
