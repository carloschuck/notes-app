import React, { useState } from 'react';

const NoteForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isTodo, setIsTodo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit({ title: title.trim(), content: content.trim(), isTodo });
      setTitle('');
      setContent('');
      setIsTodo(false);
    }
  };

  return (
    <div className="note-form">
      <h2>Create New Note</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            required
            autoFocus
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="content">Content</label>
          <textarea
            id="content"
            className="form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={isTodo}
              onChange={(e) => setIsTodo(e.target.checked)}
            />
            <span className="form-checkbox-text">Create as a to-do item</span>
          </label>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
