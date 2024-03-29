// core modules at top
const express = require('express')
const morgan = require('morgan')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require(`./routes/tourRoutes`)
const userRouter = require(`./routes/userRoutes`)

const app = express()

// MIDDLEWARE
// order for middleware matters
// express.json called before middleware below it

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json()) // middleware that lets req.body appear as json
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next() // have to call next to progress to respond
})

// ROUTES

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// If route not caught then this error message runs instead
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server`
    // })

    // const err = new Error(`Can't find ${req.originalUrl} on this server`)
    // err.status = 'fail'
    // err.statusCode = 404

    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app