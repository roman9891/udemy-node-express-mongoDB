module.exports = (err, req, res, next) => {
    err.statusCode = statusCode || 500
    err.status = status || 'error'

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
}