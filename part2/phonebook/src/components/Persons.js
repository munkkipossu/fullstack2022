import React from 'react'
import Person from './Person'

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
export default Persons