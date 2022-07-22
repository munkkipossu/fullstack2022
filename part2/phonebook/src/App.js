import { useState } from 'react'

const Filter = ({filter, handler}) =>
  <div>
    filter shown with 
    <input value={filter} onChange={handler} />
  </div>

const PersonForm = ({formHandler, name, nameHandler, number, numberHandler}) => 
  <form onSubmit={formHandler}>
      <div>
        name: <input 
        value={name}
        onChange={nameHandler}
        />
      </div>
      <div>
        number: <input 
        value={number}
        onChange={numberHandler}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>

const Persons = ({persons, filter}) => {
  const nameFilter = person => person.name.toLowerCase().includes(filter.toLowerCase())
  const personFormatter = person => <p key={person.name}>{person.name} {person.number}</p>
  return (
    <div>{persons.filter(nameFilter).map(personFormatter)}</div>
  )
}

const App = () => {
  const [persons, setPersons] = useState(
    [
      { name: 'Arto Hellas', number: '040-123456', id: 1 },
      { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
      { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
      { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ]
  ) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const addName = (event) => {
    event.preventDefault()
    if (persons.map(person => person.name).includes(newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat({name: newName, number: newNumber, id:persons.length() + 1}))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={nameFilter} handler={handleNameFilterChange}/>
      <h2>add a new</h2>
      <PersonForm 
        formHandler={addName} 
        name={newName} 
        nameHandler={handleNameChange} 
        number={newNumber} 
        numberHandler={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={nameFilter}/>
    </div>
  )
}

export default App