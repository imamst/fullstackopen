require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

morgan.token('payload', function (req, res) { return JSON.stringify(req.body) })

app.use(express.static('dist'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'));

app.get('/api/persons', (request, response, next) => {
  // add breakpoint here
  console.log("api/persons")

  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const payload = request.body

  if (!payload?.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  const newPerson = new Person({
    name: payload.name,
    number: payload.number
  })

  newPerson.save()
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number} = request.body

  Person.findByIdAndUpdate(
      request.params.id,
      {
        name,
        number
      },
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const options = {
    weekday: 'long',       // Day of the week (e.g., Wednesday)
    year: 'numeric',       // Year (e.g., 2024)
    month: 'long',         // Month (e.g., August)
    day: 'numeric',        // Day of the month (e.g., 28)
    hour: 'numeric',       // Hour (e.g., 11)
    minute: 'numeric',     // Minute (e.g., 30)
    second: 'numeric',     // Second (e.g., 15)
    timeZoneName: 'long'   // Full time zone name (e.g., Greenwich Mean Time)
  };
  const time = new Date().toLocaleString('en-US', options);

  Person.countDocuments()
    .then(total => {
      response.send(`Phonebook has info for ${total} people <br/> ${time}`)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandling = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
}

app.use(errorHandling)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})