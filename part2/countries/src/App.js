import {useState, useEffect} from 'react'
import axios from 'axios'

const apiKey = process.env.REACT_APP_WEATHER_API_KEY

const Filter = ({filter, handler}) =>
  <div>
    find countries:  
    <input value={filter} onChange={handler} />
  </div>

const Weather = ({prediction}) =>
   <>
    <img src={`http://openweathermap.org/img/wn/${prediction.weather[0].icon}@2x.png`} alt="Weather icon"/>
    <p>{(prediction.main.temp - 273).toFixed(2)} degrees Celcius, {prediction.weather[0].description}</p>
    <p>wind {prediction.wind.speed} m/s</p>
  </>

const Country = ({country}) => {
  const [weather, setWeather] = useState(null)
  useEffect(() => {
    if (country.capital) {
      axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&appid=${apiKey}`)
      .then(response => {
        console.log(response.data);
        setWeather(response.data)
      })
    }
  }, [])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>Flag: {country.flag}</div>
      {country.capital ? <p>Capital: {country.capital[0]}</p> : ''}
      <p>Population: {country.population}</p>
      <p>Land area: {country.area}</p>
      { country.languages ?
      <div>Languages:
        <ul>
          {Object.entries(country.languages).map(x => <li key={x[0]}>{x[1]}</li>)}
        </ul>
      </div>
      : ''  
      }
      {country.capital ? <div> 
        <h3>Weather in {country.capital[0]}</h3>
        {weather ? <Weather prediction={weather} /> : ''}
        </div>
        : ''
      }
      </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [buttons, setButtons] = useState([])
  const [filter, setFilter] = useState('')

  const filterHandler = (event) => setFilter(event.target.value)

  const flipButton = (index) => () => {
    console.log('Setting button handler for ', index);
    setButtons(buttons.map((x, i) => i === index ? !x : x))
  }

  const showCountries = () =>{
    if (countries.length === 0){
      return <p>still loading countries</p>
    }
    const matchingCountries = countries.filter(x => x.name.common.toLowerCase().includes(filter.toLowerCase()))
    if (matchingCountries.length === 0){
      return <p>No countries found, too strict filter</p>
    } else  if (matchingCountries.length === 1){
      return (<Country country={matchingCountries[0]} />);
    } else if (matchingCountries.length < 10){
      console.log(matchingCountries[0].name.common);
      console.log(countries.indexOf(matchingCountries[0]));
      return matchingCountries.map(
        (x) => <div key={x.name.common}>{x.name.common} <button onClick={flipButton(countries.indexOf(x))}>{buttons[countries.indexOf(x)] ? 'hide' : 'show'}</button>{buttons[countries.indexOf(x)] ? <Country country={x} /> : ''} </div >)
    }
    
    return <p>More than 10 countries, specify the filter</p>
    
  }

  useEffect(() => {
    console.log('effect - getting data on countries')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('received data')
        console.log(response.data)
        setCountries(response.data)
        setButtons(response.data.map(x => false))
      })
    }, [])
  
  
  return (
    <div>
      <Filter filter={filter} handler={filterHandler} />
      {showCountries()}
    </div>
  );
}

export default App;
