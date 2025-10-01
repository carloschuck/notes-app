import React, { useState, useEffect } from 'react';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import NoteEditor from './components/NoteEditor';
import './App.css';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080';

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new note
  const createNote = async (noteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      if (response.ok) {
        const newNote = await response.json();
        setNotes(prev => [newNote, ...prev]);
        setSelectedNote(newNote);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // Update an existing note
  const updateNote = async (id, noteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(prev => prev.map(note => 
          note.id === id ? updatedNote : note
        ));
        setSelectedNote(updatedNote);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${id}/toggle`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(prev => prev.map(note => 
          note.id === id ? updatedNote : note
        ));
        setSelectedNote(updatedNote);
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setNotes(prev => prev.filter(note => note.id !== id));
        if (selectedNote && selectedNote.id === id) {
          setSelectedNote(null);
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleNewNote = () => {
    setIsCreating(true);
    setSelectedNote(null);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading your notes...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Notes App</h1>
        <button className="new-note-btn" onClick={handleNewNote}>
          + New Note
        </button>
      </header>

      <div className="app-content">
        <div className="sidebar">
          <NoteList 
            notes={notes}
            selectedNote={selectedNote}
            onNoteSelect={handleNoteSelect}
            onDeleteNote={deleteNote}
          />
        </div>

        <div className="main-content">
          {isCreating ? (
            <NoteForm
              onSubmit={createNote}
              onCancel={handleCancel}
            />
          ) : selectedNote ? (
            <NoteEditor
              note={selectedNote}
              isEditing={isEditing}
              onEdit={handleEdit}
              onSave={updateNote}
              onCancel={handleCancel}
              onDelete={deleteNote}
              onToggleTodo={toggleTodo}
            />
          ) : (
            <div className="welcome">
              <h2>Welcome to Notes App</h2>
              <p>Select a note from the sidebar or create a new one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
