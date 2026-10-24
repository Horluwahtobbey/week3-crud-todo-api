
const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies
 
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];
 
// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});
 
// GET Active – Array bonus (filter !completed)
// NOTE: must come BEFORE '/todos/:id', otherwise "active" is treated as an id
app.get('/todos/active', (req, res) => {
  const active = todos.filter((t) => !t.completed);
  res.status(200).json(active);
});
 
// GET Completed – Custom Read
// NOTE: also must come BEFORE '/todos/:id'
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.status(200).json(completed);
});
 
// GET Single – Read one by id
app.get('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.status(200).json(todo);
});
 
// POST New – Create (with validation)
app.post('/todos', (req, res) => {
  const { task } = req.body;
 
  // Validation: "task" is required and must be a non-empty string
  if (typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({ error: 'The "task" field is required' });
  }
 
  // Use highest id + 1 so ids stay unique even after deletes
  const nextId = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
  const newTodo = { id: nextId, task: task.trim(), completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});
 
// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});
 
// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id);
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});
 
// Error handler (keep last)
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});
 
const PORT = 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
