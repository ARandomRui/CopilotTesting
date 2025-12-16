const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Load tasks from localStorage
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
}

// Save tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    const tasks = loadTasks();
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="checkbox-container" onclick="toggleTask(${index})">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
            </div>
            <span>${task.text}</span>
            <div class="delete-container" onclick="deleteTask(${index})">
                <i class="fas fa-trash"></i>
            </div>
        `;
        
        taskList.appendChild(li);
    });
}

// Add task
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    
    const tasks = loadTasks();
    tasks.push({ text, completed: false });
    saveTasks(tasks);
    taskInput.value = '';
    renderTasks();
}

// Toggle task
function toggleTask(index) {
    const tasks = loadTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
}

// Delete task
function deleteTask(index) {
    const tasks = loadTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
}

// Event listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Initial render
renderTasks();
