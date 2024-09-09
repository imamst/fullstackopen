const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

personsRouter.post('/', (request, response, next) => {
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

personsRouter.get('/:id', (request, response, next) => {
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

personsRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body

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

personsRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = personsRouter