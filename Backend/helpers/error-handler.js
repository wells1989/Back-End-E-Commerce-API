function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({message: "The user is not authorized"})
    }
    // above e.g. if access token is wrong

    if (err.name === 'ValidationError') {
        return res.status(401).json({message: err})
    }
    //  validation error

    return res.status(500).json(err);
}
    // default 500 server error

module.exports = errorHandler;