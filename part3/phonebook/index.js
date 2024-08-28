const express = require('express')
const app = express()

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
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
  
  response.send(`Phonebook has info for ${persons.length} people <br/> ${time}`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})