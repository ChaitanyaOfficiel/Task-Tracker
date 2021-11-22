import { useState, useEffect } from 'react'
import Header from './components/header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'

// Main application  function
const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([
   ]
)
useEffect(() => {
  const getTask = async () =>{
    const tasksFromServer = await fetchTasks()
    setTasks(tasksFromServer)
  }
  getTask()
}, [])

// fetch tasks

const fetchTasks = async () => {
  const res = await fetch('http://localhost:3000/tasks')
  const data = await res.json()

  return data
}


// add task
const addTask = async (task) => {
  const res = await fetch('http://localhost:3000/tasks',{
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body : JSON.stringify(task)
  })
    const data = await res.json()

    setTasks([...tasks, data])
  // const id = Math.floor(Math.random() * 10000)+1
  // const newTask = {id, ...task }
  // setTasks([...tasks, newTask])
}

//  delete Task
const deleteTask = async (id) => {
  await fetch(`http://localhost:3000/tasks/${id}`,{
    method: 'DELETE'
  })
  setTasks(tasks.filter((task) => task.id !==id))
}

// Toggle remainder
const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:3000/tasks/${id}`)
  const data = await res.json()
  return data
}
const toggleReminder = async (id) =>{
  const taskToToggle = await fetchTask(id)
  const updTask = {...taskToToggle,
     remainder: !taskToToggle.remainder } 

    const res = await fetch(`http://localhost:3000/tasks/${id}`, {
      method:'PUT',
      headers:{
        'Content-type' : 'application/json'
      },
      body : JSON.stringify(updTask)
    })
    const data = await res.json()
  setTasks(tasks.map((task) => task.id === id ?
   {...task, reminder: data.remainder } : task))
}
  return (
    <div className="container">
   <Header onAdd ={() => setShowAddTask(!showAddTask)} showAddTask={showAddTask} />
   {showAddTask && <AddTask onAdd={addTask} />}
   {tasks.length > 0 ?(
   <Tasks  tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />) :(
     'No Tasks To Show')}
  <Footer />
    </div>)}



export default App

