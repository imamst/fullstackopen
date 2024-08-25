import { useState } from 'react'

const Statistics = ({good, neutral, bad}) => {
  return (
    <>
      <p><b>statistics</b></p>
      
      {
        (good || neutral || bad) ?
        (
          <table>
            <tbody>
              <StatisticLine text='good' value={good} />
              <StatisticLine text='neutral' value={neutral} />
              <StatisticLine text='bad' value={bad} />

              <StatisticLine text='all' value={good + neutral + bad} />
              <StatisticLine text='average' value={(good - bad) / (good + neutral + bad)} />
              <StatisticLine text='positive' value={(good / (good + neutral + bad) * 100) + '%'} />
            </tbody>
          </table>
        ) : <p>No feedback given</p>
      }
    </>
  )
}

const Button = ({ onClick, text }) => {
  return <button onClick={() => onClick?.(prev => prev + 1)}>{text}</button>
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
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
      <Button onClick={() => setGood(prev => prev + 1)} text='good' />
      <Button onClick={() => setNeutral(prev => prev + 1)} text='neutral' />
      <Button onClick={() => setBad(prev => prev + 1)} text='bad' />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App