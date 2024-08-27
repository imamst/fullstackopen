import { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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

    axios
      .post('http://localhost:3001/persons', {
        name: newName,
        number: newNumber,
      })
      .then(response => {
        // entry new data if pass validation
        const newPersons = [
          ...persons,
          response.data
        ]

        setPersons(newPersons)
        setFilteredPersons(newPersons)

        // clear form
        setNewName('')
        setNewNumber('')
      })
  }

  const [filteredPersons, setFilteredPersons] = useState(persons)
  const searchPerson = (e) => {
    setFilteredPersons(
      persons.filter(
        person => person.name?.toLowerCase()?.includes(e.target.value)
      )
    )
  }

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
        setFilteredPersons(response.data)
      })
  }, [])

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