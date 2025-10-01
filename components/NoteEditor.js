import React, { useState, useEffect } from 'react';

const NoteEditor = ({ note, isEditing, onEdit, onSave, onCancel, onDelete, onToggleTodo }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isTodo, setIsTodo] = useState(note.isTodo || false);
  const [categoryId, setCategoryId] = useState(note.categoryId || 'general');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setIsTodo(note.isTodo || false);
    setCategoryId(note.categoryId || 'general');
    fetchCategories();
  }, [note]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const categoriesData = await response.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave(note.id, { title: title.trim(), content: content.trim(), isTodo, categoryId });
    }
  };

  const handleToggleTodo = () => {
    if (note.isTodo && onToggleTodo) {
      onToggleTodo(note.id);
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

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'General', color: '#4CAF50' };
  };

  return (
    <div className="note-editor">
      <div className="note-editor-header">
        <div className="note-editor-title-section">
          {note.isTodo && !isEditing && (
            <button 
              className={`todo-checkbox ${note.isCompleted ? 'completed' : ''}`}
              onClick={handleToggleTodo}
              title={note.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {note.isCompleted ? '✓' : '○'}
            </button>
          )}
          <h2 className="note-editor-title">
            {isEditing ? 'Edit Note' : note.title}
          </h2>
        </div>
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

          <div className="form-group">
            <label className="form-label" htmlFor="edit-category">Category</label>
            <select
              id="edit-category"
              className="form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={isTodo}
                onChange={(e) => setIsTodo(e.target.checked)}
              />
              <span className="form-checkbox-text">Mark as to-do item</span>
            </label>
          </div>
        </div>
      ) : (
        <div>
          <div className={`note-content ${note.isTodo && note.isCompleted ? 'completed' : ''}`}>
            {note.content}
          </div>
          <div className="note-meta">
            <div>Created: {formatDate(note.createdAt)}</div>
            <div>Last updated: {formatDate(note.updatedAt)}</div>
            <div className="note-category">
              <span 
                className="category-badge" 
                style={{ backgroundColor: getCategoryInfo(note.categoryId).color }}
              >
                {getCategoryInfo(note.categoryId).name}
              </span>
            </div>
            {note.isTodo && (
              <div className="todo-status">
                Status: {note.isCompleted ? '✅ Completed' : '⏳ Pending'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;
