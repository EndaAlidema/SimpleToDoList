const apiUrl = 'http://localhost:3000/todos';

async function fetchTodos() {
    const res = await fetch(apiUrl);
    const todos = await res.json();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${todo.task}</span>
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete('${todo._id}', this.checked)">
            <button onclick="deleteTodo('${todo._id}')">Delete</button>
        `;
        todoList.appendChild(listItem);
    });
}

async function addTodo() {
    const newTask = document.getElementById('new-task').value;
    if (!newTask) return;

    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: newTask })
    });

    const todo = await res.json();
    document.getElementById('new-task').value = '';
    fetchTodos();
}

async function toggleComplete(id, completed) {
    await fetch(`${apiUrl}/${id}`, { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed })
    });
    fetchTodos();
}


async function deleteTodo(id) {
    await fetch(`${apiUrl}/${id}`, {  
        method: 'DELETE'
    });
    fetchTodos();
}


fetchTodos();
