import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newId, setNewId] = useState(persons?.length)

  const handleChangeName = (e) => {
    setNewName(e.target.value)
  }

  const handleChangeNumber = (e) => {
    setNewNumber(e.target.value)
  }

  const addPerson = (e) => {
    e.preventDefault()

    // unique name validation
    const isNameAlreadyExists = Boolean(persons.find((person) => person.name == newName)?.name)

    if (isNameAlreadyExists) {
      alert(`${newName} is already add to phonebook`)

      return
    }

    // entry new data if pass validation
    const newPersons = [
      ...persons,
      {
        id: newId + 1,
        name: newName,
        number: newNumber,
      }
    ]

    setPersons(newPersons)
    setFilteredPersons(newPersons)

    // clear form and set new id
    setNewId(prev => prev + 1)
    setNewName('')
    setNewNumber('')
  }

  const [filteredPersons, setFilteredPersons] = useState(persons)
  const searchPerson = (e) => {
    setFilteredPersons(
      persons.filter(
        person => person.name.includes(e.target.value)
      )
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        filter shown with: <input onChange={searchPerson} />
      </div>

      <br />

      <form onSubmit={addPerson}>
        <h1><b>add a new</b></h1>
        <div>
          name: <input value={newName} onChange={handleChangeName} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleChangeNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {filteredPersons.map((person) => <p key={person.id}>{person.name} {person.number}</p>)}
      </div>
    </div>
  )
}

export default App