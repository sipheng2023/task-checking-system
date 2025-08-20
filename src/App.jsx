import React from 'react'
import TaskForm from './components/TaskForm.jsx'
import TaskList from './components/TaskList.jsx'
import useLocalStorage from './hooks/useLocalStorage.js'

export default function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', [])
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState('all')     // all | active | done
  const [priority, setPriority] = React.useState('all') // all | high | medium | low
  const [sortBy, setSortBy] = React.useState('due')     // due | created

  function addTask(task) {
    const now = new Date().toISOString()
    setTasks(prev => [
      {
        id: crypto.randomUUID(),
        title: task.title.trim(),
        notes: task.notes?.trim() || '',
        dueAt: task.dueAt || '',
        priority: task.priority || 'medium',
        done: false,
        createdAt: now,
      },
      ...prev,
    ])
  }

  function toggleDone(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function updateTask(id, updates) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    setTasks(prev => prev.filter(t => !t.done))
  }

  function markAllDone() {
    setTasks(prev => prev.map(t => ({ ...t, done: true })))
  }

  const counts = React.useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.done).length
    const active = total - completed
    return { total, active, completed }
  }, [tasks])

  // Derived list: search, filter, sort
  const visible = React.useMemo(() => {
    let list = [...tasks]

    // search
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.notes.toLowerCase().includes(q)
      )
    }

    // status filter
    if (status === 'active') list = list.filter(t => !t.done)
    if (status === 'done') list = list.filter(t => t.done)

    // priority filter
    if (priority !== 'all') list = list.filter(t => t.priority === priority)

    // sort
    if (sortBy === 'due') {
      list.sort((a, b) => {
        // empty due dates go last
        if (!a.dueAt && !b.dueAt) return 0
        if (!a.dueAt) return 1
        if (!b.dueAt) return -1
        return a.dueAt.localeCompare(b.dueAt)
      })
    } else {
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }

    return list
  }, [tasks, query, status, priority, sortBy])

  return (
    <div className="app">
      <header className="app__header">
        <h1>Task Checking System By Sipheng</h1>
        <p className="muted">
          Add tasks, check them off, search, filter, and manage your work.
        </p>
      </header>

      <section className="panel">
        <TaskForm onSubmit={addTask} />
      </section>

      <section className="toolbar">
        <input
          className="input"
          placeholder="Search tasks…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        <div className="filters">
          <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="done">Completed</option>
          </select>

          <select className="select" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="all">Priority: All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select className="select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="due">Sort: Due date</option>
            <option value="created">Sort: Newest</option>
          </select>
        </div>

        <div className="actions">
          <button className="btn" onClick={markAllDone} title="Mark all completed">Mark all done</button>
          <button className="btn btn--danger" onClick={clearCompleted} title="Remove completed tasks">Clear completed</button>
        </div>
      </section>

      <section className="panel">
        <div className="stats">
          <span>Total: {counts.total}</span>
          <span>Active: {counts.active}</span>
          <span>Completed: {counts.completed}</span>
        </div>

        <TaskList
          tasks={visible}
          onToggle={toggleDone}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      </section>

      <footer className="app__footer">
        <small className="muted">Data is saved locally in your browser.</small>
      </footer>
    </div>
  )
}
