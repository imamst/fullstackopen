import { useState } from 'react'

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

      <p><b>statistics</b></p>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  )
}

export default App