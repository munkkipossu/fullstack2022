import { useState, useEffect } from 'react'
import personService from './services/persons'


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

const Person = ({name, number, deletePerson}) => {
  return <li>
    {name} {number}
    <button onClick={deletePerson}>delete</button>
  </li>
}


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    console.log('effect - getting phonebook data')
    personService
      .getAll()
        .then(persons => {
        console.log('received data')
        setPersons(persons)
      })
    }, [])
    
  const addName = (event) => {
    event.preventDefault()
    if (persons.map(person => person.name).includes(newName)) {
      if(window.confirm(`Person named "${newName}" exists already, update number?`)){
        const oldPerson = persons[persons.map(person => person.name).indexOf(newName)]
        personService
          .update({...oldPerson, number: newNumber})
          .then(updatedPerson => {
            setPersons(persons.filter(person => person.id !== updatedPerson.id).concat(updatedPerson))
            setNewName('')
            setNewNumber('')    
            }
        )
      }
    } else {
      personService
        .create({name: newName, number: newNumber})
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')    
        })
    }
  }

  const deletePerson = (id) => {
    return () => {
      if (window.confirm('Do you really really wanna delete this person?')) {
        personService.deletePerson(id)
        setPersons(persons.filter(person => person.id !== id))
      }
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
      <ul>
      {
        persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()))
          .map(person => 
            <Person key={person.id}
              name={person.name} 
              number={person.number}
              deletePerson={deletePerson(person.id)} />
          )
      }
      </ul>
    </div>
  )
}

export default App