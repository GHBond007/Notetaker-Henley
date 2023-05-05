// Import required modules
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create an instance of the Express app
const app = express();

// Set a port for the server to listen on
const PORT = process.env.PORT || 3000;

// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

console.log(path.join(__dirname, '..', 'public'));

// Add a route to serve the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'notes.html'));
});



// API route to get all notes
app.get('/api/notes', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, '..', 'db', 'db.json'), 'utf8');
  res.json(JSON.parse(data));
});

// API route to save a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  console.log(newNote);

  const data = fs.readFileSync(path.join(__dirname, '..', 'db', 'db.json'), 'utf8');
  const notes = JSON.parse(data);

  newNote.id = notes.length > 0 ? notes[notes.length - 1].id + 1 : 1;

  console.log(newNote);
  
  notes.push(newNote);

  fs.writeFileSync(path.join(__dirname, '..', 'db', 'db.json'), JSON.stringify(notes), 'utf8');
  res.json(newNote);
});


// API route to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);

  const data = fs.readFileSync(path.join(__dirname, '..', 'db', 'db.json'), 'utf8');
  const notes = JSON.parse(data);

  const noteIndex = notes.findIndex(note => note.id === noteId);

  if (noteIndex === -1) {
    res.status(404).json({ error: 'Note not found' });
  } else {
    const deletedNote = notes.splice(noteIndex, 1);
    fs.writeFileSync(path.join(__dirname, '..', 'db', 'db.json'), JSON.stringify(notes), 'utf8');
    res.json(deletedNote);
  }
});



// If no routes match, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
