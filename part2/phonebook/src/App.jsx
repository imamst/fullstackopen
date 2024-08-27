import { useEffect, useState } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [successMessage, setSuccessMessage] = useState()

  const handleChangeName = (e) => {
    setNewName(e.target.value)
  }

  const handleChangeNumber = (e) => {
    setNewNumber(e.target.value)
  }

  const addPerson = (e) => {
    e.preventDefault()

    // unique name validation
    const existingPerson = persons.find((person) => person.name == newName)

    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already add to phonebook, replace the old number with a new one?`)) {
        personService
          .update(existingPerson.id, {
            name: existingPerson.name,
            number: newNumber,
          })
          .then(updatedPerson => {
            // entry new data if pass validation
            const newPersons = persons.map(person => person.id == updatedPerson.id ? updatedPerson : person)

            setPersons(newPersons)
            setFilteredPersons(newPersons)

            // clear form
            setNewName('')
            setNewNumber('')
          })
          .finally(() => {
            setSuccessMessage(`Updated ${existingPerson.name}`)

            setTimeout(() => setSuccessMessage(), 3000)
          })
      }

      return
    }

    personService
      .create({
        name: newName,
        number: newNumber,
      })
      .then(newPerson => {
        // entry new data if pass validation
        const newPersons = [
          ...persons,
          newPerson
        ]

        setPersons(newPersons)
        setFilteredPersons(newPersons)

        // clear form
        setNewName('')
        setNewNumber('')
      })
      .finally(() => {
        setSuccessMessage(`Added ${newName}`)

        setTimeout(() => setSuccessMessage(), 3000)
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
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
        setFilteredPersons(persons)
      })
  }, [])

  const onDeletePerson = personToDelete => {
    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      personService
        .destroy(personToDelete.id)
        .then((deletedPerson) => {
          const newPersons = persons.filter(person => person.id != deletedPerson.id)
  
          setPersons(newPersons)
          setFilteredPersons(newPersons)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      { successMessage && (
        <div style={{
          marginTop: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#dcfce7',
          borderRadius: '10px',
          width: '50%',
          padding: '1rem'
        }
        }>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#15803d',
            marginTop: 0,
            marginBottom: 0
          }}>{ successMessage }</p>
        </div>
      )}

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

      <Persons persons={filteredPersons} onDelete={onDeletePerson} />
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

const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons?.map((person) => <p key={person.id}>{person.name} {person.number} <button onClick={() => onDelete(person)}>delete</button></p>)}
    </div>
  )
}

export default App