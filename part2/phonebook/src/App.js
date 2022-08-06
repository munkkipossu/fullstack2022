import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  const style = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  }

  return (
    <div style={style} className='notification'>
      {message}
    </div>
  )
}


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
  return (
    <li>
      {name} {number}
      <button onClick={deletePerson}>delete</button>
    </li>
  )}

const Persons = ({persons, nameFilter, deletePerson}) => {
  return (
    <ul>
      {
        persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()))
          .map(person => 
            <Person key={person.id}
              name={person.name} 
              number={person.number}
              deletePerson={deletePerson(person)} />
          )
      }
    </ul>

  )
}
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notifyMessage, setNotifyMessage] = useState(null)

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
            setNotifyMessage(`Updated ${updatedPerson.name} phonenumber to ${updatedPerson.number}`)
            setTimeout(() => {setNotifyMessage(null)}, 6000)
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
          setNotifyMessage(`Added ${returnedPerson.name}, number ${returnedPerson.number}`)
          setTimeout(() => {setNotifyMessage(null)}, 6000)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')    
        })
    }
  }

  const deletePerson = (deletePerson) => {
    return () => {
      if (window.confirm('Do you really really wanna delete this person?')) {
        personService.deletePerson(deletePerson.id).then(() => {
          setNotifyMessage(`Deleted ${deletePerson.name}`)
          setTimeout(() => {setNotifyMessage(null)}, 6000)
          setPersons(persons.filter(person => person.id !== deletePerson.id))
        })
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
      <Notification message={notifyMessage} />
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
      <Persons persons={persons} nameFilter={nameFilter} deletePerson={deletePerson}/>
    </div>
  )
}

export default App