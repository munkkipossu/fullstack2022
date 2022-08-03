import {useState, useEffect} from 'react'
import axios from 'axios'

const Filter = ({filter, handler}) =>
  <div>
    find countries:  
    <input value={filter} onChange={handler} />
  </div>

const Country = ({country}) => 
  <div>
    <h2>{country.name.common}</h2>
    <div>Flag: {country.flag}</div>
    <p>Capital: {country.capital[0]}</p>
    <p>Population: {country.population}</p>
    <p>Land area: {country.area}</p>
    <div>Languages:
      <ul>
        {Object.entries(country.languages).map(x => <li key={x[0]}>{x[1]}</li>)}
      </ul>
    </div>
  </div>
  
function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  const filterHandler = (event) => setFilter(event.target.value)

  const showCountries = () =>{
    const matchingCountries = countries.filter(x => x.name.common.toLowerCase().includes(filter.toLowerCase()))
    
    if (matchingCountries.length === 1){
      return (<Country country={matchingCountries[0]} />);
    } else if (matchingCountries.length < 10){
      return matchingCountries.map(x => <p key={x.name.common}>{x.name.common}</p>)
    }
    
    return ('More than 10 countries')
    
  }

  useEffect(() => {
    console.log('effect - getting data on countries')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('received data')
        console.log(response.data)
        setCountries(response.data)
      })
    }, [])
  
  
  return (
    <div>
      <Filter filter={filter} handler={filterHandler} />
      <div>
        {showCountries()}
      </div>
    </div>
  );
}

export default App;
