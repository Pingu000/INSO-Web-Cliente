import { useState } from 'react'
import FormToDo from './FormToDo'
import ToDo from './ToDo'

function ListToDo() {
  const [tasks, setTasks] = useState([])

  const addTask = (task) => {
    if (task.text.trim()) {
      const updatedTasks = [task, ...tasks]
      setTasks(updatedTasks)
    }
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const completeTask = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) task.completed = !task.completed
      return task
    })
    setTasks(updatedTasks)
  }

  return (
    <>
      <FormToDo onSubmit={addTask} />
      <div className='list-todo-container'>
        {tasks.map((task) => (
          <ToDo
            key={task.id}
            id={task.id}
            text={task.text}
            completed={task.completed}
            deleteToDo={deleteTask}
            completeToDo={completeTask}
          />
        ))}
      </div>
    </>
  )
}

export default ListToDo
