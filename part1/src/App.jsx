const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content content={[[part1, exercises1], [part2, exercises2], [part3, exercises3]]} />
      <Total total={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

const Header = (props) => {
  return <h1>{props.course}</h1>
}

const Content = (props) => {
  return <>
    {props.content.map((content, index) => <Part key={index} text={`${content[0]} ${content[1]}`} />)}
  </>
}

const Total = (props) => {
  return <p>Number of exercises {props.total}</p>
}

const Part = (props) => {
  return <p>{props.text}</p>
}

export default App