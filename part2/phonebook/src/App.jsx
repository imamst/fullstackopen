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
        person => person.name?.toLowerCase()?.includes(e.target.value)
      )
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter onChange={searchPerson}/>

      <br />
      
      <h3><b>Add a new</b></h3>

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onChangeInputName={handleChangeName}
        newNumber={newNumber}
        onChangeInputNumber={handleChangeNumber}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} />
    </div>
  )
}

const Filter = ({ onChange }) => {
  return (
    <div>
      filter shown with: <input onChange={onChange} />
    </div>
  )
}

const PersonForm = ({onSubmit, newName, onChangeInputName, newNumber, onChangeInputNumber}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input required value={newName} onChange={onChangeInputName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={onChangeInputNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons }) => {
  return (
    <div>
      {persons?.map((person) => <p key={person.id}>{person.name} {person.number}</p>)}
    </div>
  )
}

export default App