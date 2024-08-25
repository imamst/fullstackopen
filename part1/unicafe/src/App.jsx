import { useState } from 'react'

const Statistics = ({good, neutral, bad}) => {
  return (
    <>
      <p><b>statistics</b></p>
      
      {
        (good || neutral || bad) ?
        (
          <>
            <p>good {good}</p>
            <p>neutral {neutral}</p>
            <p>bad {bad}</p>

            <p>all {good + neutral + bad}</p>
            <p>average {(good - bad) / (good + neutral + bad)}</p>
            <p>positive {(good / (good + neutral + bad) * 100)} %</p>
          </>
        ) : <p>No feedback given</p>
      }
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <p><b>give feedback</b></p>
      <button onClick={() => setGood(prev => prev + 1)}>good</button>
      <button onClick={() => setNeutral(prev => prev + 1)}>neutral</button>
      <button onClick={() => setBad(prev => prev + 1)}>bad</button>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App