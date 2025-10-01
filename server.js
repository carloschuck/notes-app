const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const serveStatic = require('serve-static');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for notes (in production, you'd use a database)
let notes = [
  {
    id: uuidv4(),
    title: 'Welcome to Notes App',
    content: 'This is your first note! You can edit or delete it.',
    isTodo: false,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// API Routes

// Get all notes
app.get('/api/notes', (req, res) => {
  res.json(notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
});

// Get a specific note
app.get('/api/notes/:id', (req, res) => {
  const note = notes.find(n => n.id === req.params.id);
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.json(note);
});

// Create a new note
app.post('/api/notes', (req, res) => {
  const { title, content, isTodo } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newNote = {
    id: uuidv4(),
    title: title.trim(),
    content: content.trim(),
    isTodo: Boolean(isTodo),
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// Update a note
app.put('/api/notes/:id', (req, res) => {
  const { title, content, isTodo, isCompleted } = req.body;
  const noteIndex = notes.findIndex(n => n.id === req.params.id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    title: title.trim(),
    content: content.trim(),
    isTodo: isTodo !== undefined ? Boolean(isTodo) : notes[noteIndex].isTodo,
    isCompleted: isCompleted !== undefined ? Boolean(isCompleted) : notes[noteIndex].isCompleted,
    updatedAt: new Date().toISOString()
  };

  res.json(notes[noteIndex]);
});

// Toggle todo completion
app.patch('/api/notes/:id/toggle', (req, res) => {
  const noteIndex = notes.findIndex(n => n.id === req.params.id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  if (!notes[noteIndex].isTodo) {
    return res.status(400).json({ error: 'Note is not a todo item' });
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    isCompleted: !notes[noteIndex].isCompleted,
    updatedAt: new Date().toISOString()
  };

  res.json(notes[noteIndex]);
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteIndex = notes.findIndex(n => n.id === req.params.id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  notes.splice(noteIndex, 1);
  res.status(204).send();
});

// Serve static files from the React app build directory
app.use(serveStatic(path.join(__dirname, 'client/build')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Notes app server running on port ${PORT}`);
});
