const Hello = (props) => {
    return (
          <div>
            <p>Hello {props.name}</p>
          </div>
    )
}

const Footer = () => {
  return (
    <div>
      greeting app created by <a href="https://github.com/munkkipossu">mp</a>
    </div>
  )
}

const App = () => {
  return (
    <>
      <h1>Greetings</h1>
      <Hello name="Huti" />
      <Hello name="Vinny" />
      <Footer /> 
    </>
  )
}
export default App