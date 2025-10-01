import React from 'react';

const NoteList = ({ notes, selectedNote, onNoteSelect, onDeleteNote }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getPreview = (content) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  return (
    <div className="note-list">
      {notes.length === 0 ? (
        <div style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', padding: '2rem' }}>
          No notes yet. Create your first note!
        </div>
      ) : (
        notes.map(note => (
          <div
            key={note.id}
            className={`note-item ${selectedNote && selectedNote.id === note.id ? 'selected' : ''}`}
            onClick={() => onNoteSelect(note)}
          >
            <div className="note-item-header">
              <h3 className="note-title">{note.title}</h3>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this note?')) {
                    onDeleteNote(note.id);
                  }
                }}
              >
                ×
              </button>
            </div>
            <p className="note-preview">{getPreview(note.content)}</p>
            <div className="note-date">{formatDate(note.updatedAt)}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default NoteList;
