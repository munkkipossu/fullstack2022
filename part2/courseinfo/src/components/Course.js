import React from 'react'

const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ sum }) => <p><b>Number of exercises {sum}</b></p>

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Content = ({ parts }) => 
    <div>
        {parts.map(part => <Part key={part.id} part={part} />)}
    </div>

const Course = ({course}) =>
    <>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total sum={course.parts.reduce((s, part) =>  s + part.exercises, 0)} />
    </>

export default Course
