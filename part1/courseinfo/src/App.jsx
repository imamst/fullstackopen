const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <>
      {courses.map((course) => <Course key={course.id} course={course} />)}
    </>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content content={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = ({ name }) => {
  return <h1>{name}</h1>
}
const Content = ({ content }) => {
  return <>
    {content.map((content, index) => <Part key={index} text={`${content.name} ${content.exercises}`} />)}
  </>
}
const Total = ({ parts }) => {
  return <p><b>total of {parts?.reduce((acc, part) => part.exercises + acc, 0)} exercise(s)</b></p>
}
const Part = ({ text }) => {
  return <p>{text}</p>
}
export default App