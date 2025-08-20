import React from 'react'
import TaskItem from './TaskItem.jsx'

export default function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  if (!tasks.length) {
    return <p className="muted">No tasks match your filters.</p>
  }

  return (
    <ul className="list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onDelete={() => onDelete(task.id)}
          onUpdate={(updates) => onUpdate(task.id, updates)}
        />
      ))}
    </ul>
  )
}
