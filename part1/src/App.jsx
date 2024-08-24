const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />
      <Content content={parts} />
      <Total parts={parts} />
    </div>
  )
}

const Header = (props) => {
  return <h1>{props.course}</h1>
}

const Content = (props) => {
  return <>
    {props.content.map((content, index) => <Part key={index} text={`${content.name} ${content.exercises}`} />)}
  </>
}

const Total = (props) => {
  return <p>Number of exercises {props.parts?.reduce((acc, part) => part.exercises + acc, 0)}</p>
}

const Part = (props) => {
  return <p>{props.text}</p>
}

export default App