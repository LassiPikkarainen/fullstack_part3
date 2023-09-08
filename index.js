const express = require('express')
var morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(express.json())
app.use(cors())

morgan.token('content', function(req, res) {
    if (Object.keys(req.body).length > 0){
        return JSON.stringify(req.body)
    }
    else{
        return " "
    }
    
 })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
      { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
    ]


app.get('/', (req, res) => {
    res.json(persons)
})
      
app.get('/info', (req, res) => {
    date = new Date()
    console.log(date)
    let str = `Phonebook has info for ${persons.length} people`
    res.send(`<p> ${str} </p> <p> ${date}</p>`)
})

app.get('/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
    
  })

  app.delete('/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    
    const newpersons = []
    persons.forEach((person) => {
        if (person.id !== id) {
            newpersons.push(person)
        }
    })

    persons = newpersons
    res.json(persons)
})

app.post("/api/persons", (req, res) => {
    const id = Math.floor(Math.random()*10000)

    const name = req.body.name
    const number = req.body.number

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
            const person = {
                name: name,
                number: number,
                id: id
            }
            persons.push(person)
            res.json(persons)
        }
        else{
            res.status(400).send({ error: 'the name is already present in the phonebook' })
        }
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

console.log(`Server running on port ${PORT}`)