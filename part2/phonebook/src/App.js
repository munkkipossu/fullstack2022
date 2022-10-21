import { useState, useEffect } from 'react'
import personService from './services/persons'
import Persons from './components/Persons'
import Notification from './components/Notification'
import Filter from './components/Filter'

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


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notifyMessage, setNotifyMessage] = useState(null)
  const [errorState, setErrorState] = useState(false)

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
        ).catch( error => {
          console.log(error);
          if (error.response.data.error){
            setErrorState(true)
            setNotifyMessage(
              error.response.data.error,
              'red'
            )
            setTimeout(() => {setErrorState(false); setNotifyMessage(null)}, 6000)
  
          } else {
            setErrorState(true)
            setNotifyMessage(
              `"${newName}" has already been deleted`,
              'red'
            )
            setTimeout(() => {setErrorState(false); setNotifyMessage(null)}, 6000)
            setPersons(persons.filter(person => person.id !== oldPerson.id))
            setNewName('')
            setNewNumber('')    
            }
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
        .catch( error => {
          setErrorState(true)
          setNotifyMessage(
            error.response.data.error,
            'red'
          )
          setTimeout(() => {setErrorState(false); setNotifyMessage(null)}, 6000)
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
        }).catch( error => {
          setErrorState(true)
          setNotifyMessage(
            `${deletePerson.name} has already been deleted`,
            'red'
          )
          setTimeout(() => {setErrorState(false); setNotifyMessage(null)}, 6000)
        }
      )
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
      <Notification message={notifyMessage} errorState={errorState} />
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