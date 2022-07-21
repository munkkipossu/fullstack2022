import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)


const StatisticLine = ({text, value}) => (
  <p>{text} {value}</p>
)

const Statistics = ({good, neutral, bad}) => {
  const total = () => good + neutral + bad
  const average = () => (good - bad)/total()
  const positive = () => good/total()*100

  if (total() === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div> 
    )
  } else {
    return (
      <div>
        <h1>statistics</h1>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <p>all {total()}</p>
        <p>average {average()}</p>
        <p>positive {positive()}%</p>
      </div>
    )
  }
}
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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App