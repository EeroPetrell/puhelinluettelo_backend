require('dotenv').config()
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))

app.get('/api/info', (req, res) => {

    const amount = Person.length

    res.send(  `<div>
                <p>Phonebook has info for ${amount} people</p>
                <p>${new Date().toUTCString()}</p>
                </div>`
            )
})

app.get('/api/persons', (req, res, next) => {
    Person
        .find({})
        .then( personsData => {
            if (personsData) {
                console.log(personsData, typeof(personsData))
                res.json(personsData)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

const errorHandler = (error, req, res, next) =>  {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

app.get('/api/persons/:id', (req, res, next) => {
    console.log('id: ', req.params.id)
    Person
        .findById(req.params.id)
        .then(person => {
            if (person) {
            res.json(person)
            } else {
            res.status(404).end()
            }
        })
        .catch(error => next(error))
    })

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    console.log(body)
  
    if (body.name === undefined || body.number === undefined) {
      return res.status(400).json({ error: 'content missing' })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person
        .save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

