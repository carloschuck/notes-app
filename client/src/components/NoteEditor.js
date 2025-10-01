import React, { useState, useEffect } from 'react';

const NoteEditor = ({ note, isEditing, onEdit, onSave, onCancel, onDelete }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave(note.id, { title: title.trim(), content: content.trim() });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      onDelete(note.id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="note-editor">
      <div className="note-editor-header">
        <h2 className="note-editor-title">
          {isEditing ? 'Edit Note' : note.title}
        </h2>
        <div className="note-editor-actions">
          {isEditing ? (
            <>
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
              <button className="btn btn-primary" onClick={onEdit}>
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="edit-content">Content</label>
            <textarea
              id="edit-content"
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="note-content">{note.content}</div>
          <div className="note-meta">
            <div>Created: {formatDate(note.createdAt)}</div>
            <div>Last updated: {formatDate(note.updatedAt)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;
