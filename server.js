const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(bodyParser.json());
app.use(cors());


app.use(express.static(path.join(__dirname)));


mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log("Connected to MongoDB"));


const todoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean
});
const Todo = mongoose.model('Todo', todoSchema);


app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/todos', async (req, res) => {
    const newTodo = new Todo({
        task: req.body.task,
        completed: false
    });
    await newTodo.save();
    res.json(newTodo);
});

app.put('/todos/:id', async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { task: req.body.task, completed: req.body.completed }, { new: true });
    res.json(updatedTodo);
});

app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
