window.onload = function() {
    checkAuth();
    updateEmptyStates();
}

// Variables
const categories = document.querySelectorAll('.container')
const tasks = document.querySelectorAll('.task')
const addNewTaskBtn = document.querySelectorAll('.addBtn')
const overScreen = document.getElementById('overScreen')
const popupForm = document.getElementById('popupForm')
const wrapper = document.querySelector('.wrapper')
const titleInput = document.getElementById('titleInput')
const descInput = document.getElementById('descInput')
const priorityInput = document.getElementById('priorityInput')
const dateInput = document.getElementById('dateInput')
const submitTaskBtn = document.querySelector('#taskForm button')
const taskForm = document.getElementById('taskForm')
const logoutBtn = document.getElementById('logoutBtn')

const apiUrl = "https://taskify-backend-26et.onrender.com"

let draggedTask = null;
let targetCategory = null;
let formCaller = null;
let editingTask = null;

// Event Listeners

overScreen.addEventListener('click', () => {
    clearTaskForm()
})

addNewTaskBtn.forEach((button) => {
    button.addEventListener("click", function() {
        overScreen.classList.toggle('hidden');
        popupForm.classList.toggle('hidden');
        startDate();
        targetCategory = button.parentElement.querySelector('.container')
        formCaller = "addNew"
    })
})

categories.forEach((category) => {
    category.addEventListener('dragover', (e) => {
        e.preventDefault()
    })
    category.addEventListener('drop', (e) => {
        category.appendChild(draggedTask)
        editingTask = draggedTask
        updateTask()
        editingTask = null
        updateEmptyStates()
    })
})

taskForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if(formCaller == "addNew"){
        console.log("Form Submitted: targetCategory = " + targetCategory )
        addTasks();
        formCaller = null;
    }
    if(formCaller == "editingTask"){
        updateTask();
        clearTaskForm();
        taskForm.querySelector("h3").innerText = "Add Task";
        taskForm.querySelector("button").innerHTML = "Add Task";
        formCaller = null;
        editingTask = null;
    }
})

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token")
    window.location.href = "/login.html"
})



// Functions
async function checkAuth(){
    try{
        const token = localStorage.getItem("token")
            if(!token) window.location.href="/login.html"
        else{
            await fetch(`${apiUrl}/`, {
                method: "GET",
                headers: {
                    token: token
                }
            })
                .then((response) => {
                    if(response.status == 401){
                        window.location.href="login.html"
                    }else{
                        return response.json()
                    }
                })
                .then((x) => loadTasks(x))
        }
    }catch(err){
        console.log(err);
    }
    
}

async function loadTasks() {
    const token = localStorage.getItem("token")

    const response = await fetch(`${apiUrl}/todos`, {
            method: "GET",
            headers: {
                token: token
            }
        }).then((x) => {return x.json()})
    const todos = response.todos;
    
    todos.forEach((todo) => {
        const todoSection = document.querySelector("#Todo .container");
        const inProgress = document.querySelector("#inProgress .container")
        const underReview = document.querySelector("#underReview .container")
        const finished = document.querySelector("#finished .container")

        const task = createTask(todo.title, todo.description, todo.tag, todo.deadline);
        if(todo.section == "todo"){
            todoSection.appendChild(task);
        }else if(todo.section == "inProgress"){
            inProgress.appendChild(task)
        }else if(todo.section == "underReview"){
            underReview.appendChild(task)
        }else if(todo.section == "finished"){
            finished.appendChild(task)
        }
    })

    updateEmptyStates();
}

async function updateTask(){
    const useForm = !overScreen.classList.contains("hidden")

    const token = localStorage.getItem("token")
    const title = editingTask.querySelector('.task-title')
    const description = editingTask.querySelector('.task-description')
    const tag = editingTask.querySelector('.task-tag')
    const deadline= editingTask.querySelector('.task-deadline')

    const newTitle = useForm ? titleInput.value : title.innerText
    const newDescription = useForm ? descInput.value : description.innerText
    const newTag = useForm ? priorityInput.value : tag.innerText
    const newDeadline = useForm ? dateInput.value : deadline.dataset.deadline
    const newSection = editingTask.parentElement.dataset.section

    await fetch(`${apiUrl}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            token: token
        },
        body: JSON.stringify({
            title: title.innerHTML,
            description: description.innerHTML,
            newTitle: newTitle,
            newDescription: newDescription,
            newTag: newTag,
            newDeadline: newDeadline,
            newSection: newSection,
        })
    })

    title.innerText = newTitle;
    description.innerText = newDescription;
    tag.classList.remove(tag.innerText)
    tag.classList.add(newTag)
    tag.innerText = newTag
    deadline.dataset.deadline = newDeadline

    const formattedDate = new Date(newDeadline).toLocaleDateString('en-US', {
        year: "numeric",
        month: "long",
        day : "numeric"
    })

    deadline.innerHTML = `<i class="fa-regular fa-clock"></i> ${formattedDate}`

    console.log("Requests were sent!")
}

async function deleteTask(taskDiv){
    const parent = taskDiv.parentElement
    const token = localStorage.getItem("token")
    const title = taskDiv.querySelector('.task-title').innerText
    const description = taskDiv.querySelector('.task-description').innerText
    const tag = taskDiv.querySelector('.task-tag').innerText

    console.log(description)
    await fetch(`${apiUrl}/`, {
        method: "DELETE" ,
        headers: {
            "Content-Type": "application/json",
            token: token
        },
        body: JSON.stringify({
            title: title,
            description: description,
            tag: tag
        })
    })  
        .then((response) => {
            console.log(response.status)
        })
    

    parent.removeChild(taskDiv)
    updateEmptyStates()
}

async function postTask(title, description, priority, deadline) {
    const token = localStorage.getItem('token')
    const category = targetCategory.dataset.section

    const response = await fetch(`${apiUrl}/`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            token: token
        },
        body: JSON.stringify({
            title: title,
            description: description,
            tag: priority,
            deadline: deadline,
            section: category
        })
    })

    if(response.status == 503){
        console.log("Failed to add Todo");
    }
}

function createTask(title, description, priority, deadline){
    const taskDiv = document.createElement('div')
    taskDiv.className = 'task'
    taskDiv.setAttribute("draggable", true)

    const delButton = document.createElement('button')
    delButton.className = 'deleteBtn'
    delButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`

    const editButton = document.createElement('button')
    editButton.className = 'editBtn'
    editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`

    const taskTitle = document.createElement('h4')
    taskTitle.classList.add('task-title')
    taskTitle.innerText = title

    const taskDescription = document.createElement('p')
    taskDescription.classList.add('task-description')
    taskDescription.innerText = description

    const taskInfoDiv = document.createElement('div')
    taskInfoDiv.classList.add('task-info')

    const taskTag = document.createElement('span')
    taskTag.classList.add('task-tag')
    taskTag.classList.add(`${priority}`)
    taskTag.innerText = priority

    const formattedDate = new Date(deadline).toLocaleDateString('en-US', {
        year: "numeric",
        month: "long",
        day : "numeric"
    })
    const taskDeadline = document.createElement('p')
    taskDeadline.dataset.deadline = deadline;
    taskDeadline.classList.add('task-deadline')
    taskDeadline.innerHTML = `<i class="fa-regular fa-clock"></i> ${formattedDate}`

    taskInfoDiv.appendChild(taskTag)
    taskInfoDiv.appendChild(taskDeadline)

    taskDiv.appendChild(delButton)
    taskDiv.appendChild(editButton)

    taskDiv.appendChild(taskTitle)
    taskDiv.appendChild(taskDescription)
    taskDiv.appendChild(taskInfoDiv)

    taskDiv.addEventListener('dragstart', () => {
        taskDiv.classList.add('dragging')
        draggedTask = taskDiv; 
    })

    taskDiv.addEventListener('dragend', () => {
        taskDiv.classList.remove('dragging')
        editingTask = taskDiv
        updateTask();
        editingTask = null;
        draggedTask = null
    })

    editButton.addEventListener('click', () => {
        editingTask = taskDiv;
        formCaller = "editingTask";
        overScreen.classList.toggle('hidden');
        popupForm.classList.toggle('hidden');
        loadEditForm()
    })

    delButton.addEventListener('click', () => {
        deleteTask(taskDiv);
    })

    return taskDiv
}

function loadEditForm(){
    const title = editingTask.querySelector('.task-title')
    const description = editingTask.querySelector('.task-description')
    const priority = editingTask.querySelector('.task-tag')
    const deadline= editingTask.querySelector('.task-deadline').dataset.deadline

    const taskFormHeading = taskForm.querySelector('h3')
    const editSubmitBtn = taskForm.querySelector("button")

    taskFormHeading.innerText = "Edit Task"
    editSubmitBtn.innerHTML = "Edit Task"

    titleInput.value = title.innerText;
    descInput.value = description.innerText;
    priorityInput.value = priority.innerText;
    startDate()
    dateInput.value = new Date(deadline).toISOString().split("T")[0];
}

function clearTaskForm(){
    titleInput.value = "";
    descInput.value = "";
    priorityInput.value = "Low";
    dateInput.value = "";
    overScreen.classList.toggle('hidden');
    popupForm.classList.toggle('hidden');
}

async function addTasks(){
    const title = titleInput.value;
    const description = descInput.value;
    const priority = priorityInput.value;
    const deadline = dateInput.value;

    const task = createTask(title, description, priority, deadline)
    targetCategory.appendChild(task)
    updateEmptyStates()
    clearTaskForm()
    // Calls function to add task in db
    await postTask(title, description, priority, deadline)
    console.log(targetCategory)
    targetCategory = null
}

function startDate(){
    const today = new Date();
    const date = String(today.getDate()).padStart(2,0)
    const month = String(today.getMonth() + 1).padStart(2,0)
    const year = String(today.getFullYear())
    minDate = `${year}-${month}-${date}`
    dateInput.setAttribute("min", minDate)
}

function updateEmptyStates(){
    categories.forEach((category) => {
        const hasTasks = category.querySelector('.task') != null;
        category.classList.toggle('empty', !hasTasks)
    })
}