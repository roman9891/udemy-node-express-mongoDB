const fs = require('fs')
const { formatTour } = require('./controllers/tourController')
const tours = JSON.parse( // parse data first
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`) // use sync method outside of callbacks so it doesn't block event loop
)

describe('starter tests', () => {
    let testTour = {}
    const name = 'roman'

    beforeEach(() => {
        testTour.name = name
    })

    test('first test', () => {
        const formattedTour = formatTour(testTour)
        
        expect(formattedTour.id).toBe(tours.length)
        expect(formattedTour.name).toBe(name)
    })
})