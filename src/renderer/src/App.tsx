import Versions from './components/Versions'
// import icons from './assets/icons.svg'

const debug = (): void => {
  console.log('test')
}
function App(): JSX.Element {
  debug()
  return (
    <div className="container">
      <Versions></Versions>
      <h1>Hello React</h1>
    </div>
  )
}

export default App
