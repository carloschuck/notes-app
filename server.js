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

// In-memory storage for notes and categories (in production, you'd use a database)
let categories = [
  { id: 'general', name: 'General', color: '#4CAF50' },
  { id: 'work', name: 'Work', color: '#2196F3' },
  { id: 'personal', name: 'Personal', color: '#FF9800' },
  { id: 'ideas', name: 'Ideas', color: '#9C27B0' }
];

let notes = [
  {
    id: uuidv4(),
    title: 'Welcome to Notes App',
    content: 'This is your first note! You can edit or delete it.',
    isTodo: false,
    isCompleted: false,
    categoryId: 'general',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// API Routes

// Categories endpoints
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const { name, color } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const newCategory = {
    id: uuidv4(),
    name: name.trim(),
    color: color || '#4CAF50'
  };

  categories.push(newCategory);
  res.status(201).json(newCategory);
});

app.put('/api/categories/:id', (req, res) => {
  const { name, color } = req.body;
  const categoryIndex = categories.findIndex(c => c.id === req.params.id);

  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  categories[categoryIndex] = {
    ...categories[categoryIndex],
    name: name.trim(),
    color: color || categories[categoryIndex].color
  };

  res.json(categories[categoryIndex]);
});

app.delete('/api/categories/:id', (req, res) => {
  const categoryIndex = categories.findIndex(c => c.id === req.params.id);

  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Check if any notes are using this category
  const notesUsingCategory = notes.some(note => note.categoryId === req.params.id);
  if (notesUsingCategory) {
    return res.status(400).json({ error: 'Cannot delete category that is being used by notes' });
  }

  categories.splice(categoryIndex, 1);
  res.status(204).send();
});

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
  const { title, content, isTodo, categoryId } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  // Validate category exists
  const category = categories.find(c => c.id === categoryId);
  if (categoryId && !category) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  const newNote = {
    id: uuidv4(),
    title: title.trim(),
    content: content.trim(),
    isTodo: Boolean(isTodo),
    isCompleted: false,
    categoryId: categoryId || 'general',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// Update a note
app.put('/api/notes/:id', (req, res) => {
  const { title, content, isTodo, isCompleted, categoryId } = req.body;
  const noteIndex = notes.findIndex(n => n.id === req.params.id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  // Validate category exists
  const category = categories.find(c => c.id === categoryId);
  if (categoryId && !category) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    title: title.trim(),
    content: content.trim(),
    isTodo: isTodo !== undefined ? Boolean(isTodo) : notes[noteIndex].isTodo,
    isCompleted: isCompleted !== undefined ? Boolean(isCompleted) : notes[noteIndex].isCompleted,
    categoryId: categoryId !== undefined ? categoryId : notes[noteIndex].categoryId,
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
