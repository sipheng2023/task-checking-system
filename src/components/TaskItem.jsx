import React from 'react'

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(task)

  React.useEffect(() => setDraft(task), [task.id]) // reset when switching items

  function saveEdits() {
    const title = draft.title?.trim()
    if (!title) return
    onUpdate({
      title,
      notes: draft.notes?.trim() || '',
      dueAt: draft.dueAt || '',
      priority: draft.priority || 'medium'
    })
    setEditing(false)
  }

  return (
    <li className={`item ${task.done ? 'item--done' : ''}`}>
      <label className="item__main">
        <input
          type="checkbox"
          checked={task.done}
          onChange={onToggle}
        />
        {!editing ? (
          <div className="item__content">
            <div className="item__title-row">
              <span className="item__title">{task.title}</span>
              <span className={`pill pill--${task.priority}`}>{task.priority}</span>
            </div>
            {(task.notes || task.dueAt) && (
              <div className="item__meta">
                {task.notes && <span className="muted">{task.notes}</span>}
                {task.dueAt && <span className="due">Due: {task.dueAt}</span>}
              </div>
            )}
          </div>
        ) : (
          <div className="item__content">
            <input
              className="input"
              value={draft.title}
              onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
            />
            <textarea
              className="textarea"
              rows={2}
              value={draft.notes}
              onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
              placeholder="Notes"
            />
            <div className="grid">
              <div>
                <label className="label">Due date</label>
                <input
                  className="input"
                  type="date"
                  value={draft.dueAt || ''}
                  onChange={e => setDraft(d => ({ ...d, dueAt: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Priority</label>
                <select
                  className="select"
                  value={draft.priority}
                  onChange={e => setDraft(d => ({ ...d, priority: e.target.value }))}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </label>

      <div className="item__actions">
        {!editing ? (
          <>
            <button className="btn btn--ghost" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn btn--danger" onClick={onDelete}>Delete</button>
          </>
        ) : (
          <>
            <button className="btn" onClick={saveEdits}>Save</button>
            <button className="btn btn--ghost" onClick={() => setEditing(false)}>Cancel</button>
          </>
        )}
      </div>
    </li>
  )
}
