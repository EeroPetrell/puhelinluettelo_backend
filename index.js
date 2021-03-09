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

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
    {
        id: 6,
        name: "Kana Katala",
        number: "666-696969"
    }
]

app.get('/api/persons', (req, res) => {
    Person.find({}).then( personsData => {
        console.log(personsData, typeof(personsData))
        res.json(personsData)
    })
})

const infosivu = (
    `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date().toUTCString()}</p>
    </div>`
)

app.get('/api/info', (req, res) => {
    res.send(infosivu)
})

app.get('/api/persons/:id', (req, res) => {
    console.log('id: ', req.params.id)
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

/* 
Vanha ei-tietokantaan perustuvan version yksittäisen resurssin haku 
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) res.json(person)
    else res.status(404).end()
})
*/

app.post('/api/persons', (req, res) => {
    const body = req.body

    console.log(body)
  
    if (body.name === undefined || body.number === undefined) {
      return res.status(400).json({ error: 'content missing' })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
  })

/*
Vanha ei-tietokantaan perustuvan version uuden yhteystiedon lisäys
app.post('/api/persons', (req, res) => {
    const newPerson = req.body
    newPerson.id = Math.floor(Math.random()*100000)
    console.log(newPerson)

    const isSame = persons.map(person=>person.name).includes(newPerson.name)
    console.log(isSame)
    if (!newPerson.name && !newPerson.number) {
        return res.status(400).json({
            error: 'name and number missing'
        })
    } else if (!newPerson.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    } else if (!newPerson.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    } else if (persons.map(person=>person.name).includes(newPerson.name)) {
        console.log('virhe')
        return res.status(400).json({
            error: 'name already on list'
        })
    }
    persons = persons.concat(newPerson)
    console.log(persons)
    res.json(newPerson)
})
*/

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log('poisto', id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

