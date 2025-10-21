import './App.css'
import Logo from './components/Logo'
import ListToDo from './components/ListToDo'

function App() {
  return (
    <div className='app-container'>
      <Logo />
      <h1>Mis Tareas</h1>
      <ListToDo />
    </div>
  )
}

export default App
