import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleChangeName = (e) => {
    setNewName(e.target.value)
  }

  const addPerson = (e) => {
    e.preventDefault()

    const isNameAlreadyExists = Boolean(persons.find((person) => person.name == newName)?.name)

    if (isNameAlreadyExists) {
      alert(`${newName} is already add to phonebook`)

      return
    }

    setPersons([
      ...persons,
      {
        name: newName
      }
    ])

    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleChangeName} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map((person) => <p key={person.name}>{person.name}</p>)}
      </div>
    </div>
  )
}

export default App