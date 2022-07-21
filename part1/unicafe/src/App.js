import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)


const Datum = ({name, value}) => (
  <p>{name} {value}</p>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => { setGood(good + 1) } 
  const increaseNeutral = () => { setNeutral(neutral + 1) } 
  const increaseBad = () => { setBad(bad + 1) } 
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={increaseGood} text="good" />
      <Button handleClick={increaseNeutral} text="neutral" />
      <Button handleClick={increaseBad} text="bad" />
      <h1>statistics</h1>
      <Datum name="good" value={good} />
      <Datum name="neutral" value={neutral} />
      <Datum name="bad" value={bad} />
    </div>
  )
}

export default App