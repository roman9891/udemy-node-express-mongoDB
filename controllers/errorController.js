const AppError = require("../utils/appError")

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
        //
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

module.exports = (err, req, res, next) => {
    console.log(err.name)

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err, name: err.name} // for some reason name won't transfer from destructuring so have to add explicitly

        if (error.name === 'CastError') error = handleCastErrorDB(error)

        sendErrorProd(error, res)
    }    
}