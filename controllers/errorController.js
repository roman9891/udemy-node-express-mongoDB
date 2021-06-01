const AppError = require("../utils/appError")
// Exported in AppError in /utils

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    // Programming or other unknown error: don't leak error details
    } else {
        // Log error
        console.error('ERROR', err)

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        })
    }
}

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const message = `Duplicate field value: ${value}. Please use another value`
    return new AppError(message, 400)
}

// Imported in globalErrorMiddleware in app.js
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err} // for some reason name won't transfer from destructuring so have to add explicitly
        // for some reason becomes undefined after destructuring duplicate field error? because mongo error different?

        if (err.name === 'CastError') error = handleCastErrorDB(err)

        if (err.code === 11000) error = handleDuplicateFieldsDB(err)

        sendErrorProd(error, res)
    }    
}