import React from 'react'

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [dueAt, setDueAt] = React.useState('')
  const [priority, setPriority] = React.useState('medium')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title, notes, dueAt, priority })
    setTitle('')
    setNotes('')
    setDueAt('')
    setPriority('medium')
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        className="input"
        placeholder="Task title *"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <textarea
        className="textarea"
        placeholder="Notes (optional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={3}
      />

      <div className="grid">
        <div>
          <label className="label">Due date</label>
          <input
            className="input"
            type="date"
            value={dueAt}
            onChange={e => setDueAt(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Priority</label>
          <select
            className="select"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="form__actions">
        <button className="btn" type="submit">Add Task</button>
      </div>
    </form>
  )
}
