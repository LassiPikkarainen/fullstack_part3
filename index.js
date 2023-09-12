const express = require('express')
require('dotenv').config()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())
//app.use(express.static('build'))

morgan.token('content', function(req, res) {
  if (Object.keys(req.body).length > 0){
    return JSON.stringify(req.body)
  }
  else{
    return ' '
  }

})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}



app.get('/', (req, res, next) => {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    res.json(result)
  })

})


app.put('/persons/:id', (req, res, next) => {
  const name = req.body.name
  const number = req.body.number
  const person = {
    name: name,
    number: number
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  date = new Date()
  console.log(date)
  let str = `Phonebook has info for ${persons.length} people`
  res.send(`<p> ${str} </p> <p> ${date}</p>`)
})

app.get('/persons/:id', (request, response, next) => {

  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }

  })
    .catch(error => next(error))
})

app.delete('/persons/:id', (request, response, next) => {
  Person.deleteOne({ _id: request.params.id }).then(result => {
    if (result.deletedCount === 1) {
      response.json(result)
    }
    else {
      response.status(404).end()
    }

  })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const name = req.body.name
  const number = req.body.number
  let persons = []
  Person.find({}).then(result => {
    persons = result
    let unique = true
    if(!name || !number){
      res.status(400).send({ error: 'no name or number specified' })
    }
    else {
      persons.forEach((person) => {
        if (person.name === name) {
          unique = false
        }
      })
      if (unique === true) {

        const person = new Person({
          name: name,
          number: number
        })
        person.save().then(savedPerson => {
          res.json(savedPerson)
        }).catch(error => next(error))
      }
      else{
        res.status(400).send({ error: 'the name is already present in the phonebook' })
      }
    }
  })
})


app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

console.log(`Server running on port ${PORT}`)