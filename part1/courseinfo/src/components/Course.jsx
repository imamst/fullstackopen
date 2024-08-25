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

export default Course