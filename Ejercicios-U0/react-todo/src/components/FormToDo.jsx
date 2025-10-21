import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import '../styles/Form.css'

function FormToDo({ onSubmit }) {
  const [input, setInput] = useState('')

  const handleChange = (e) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit({
        id: uuidv4(),
        text: input.trim(),
        completed: false
      })
      setInput('')
    }
  }

  return (
    <form className='form-todo' onSubmit={handleSubmit}>
      <input
        className='input-todo'
        type='text'
        placeholder='Escriba una tarea'
        value={input}
        onChange={handleChange}
      />
      <button className='button-todo'>Añadir tarea</button>
    </form>
  )
}

export default FormToDo
