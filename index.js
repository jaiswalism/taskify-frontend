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

let draggedTask = null;
let targetCategory = null;

// Event Listeners
window.onload = updateEmptyStates()

wrapper.addEventListener('click', () => {
    clearForm()
})

addNewTaskBtn.forEach((button) => {
    button.addEventListener("click", function() {
        overScreen.classList.toggle('hidden');
        popupForm.classList.toggle('hidden');
        startDate();
        targetCategory = button.parentElement.querySelector('.container')
    })
})

categories.forEach((category) => {
    category.addEventListener('dragover', (e) => {
        e.preventDefault()
    })
    category.addEventListener('drop', (e) => {
        category.appendChild(draggedTask)
        updateEmptyStates()
    })
})

taskForm.addEventListener("submit", (e) => {
    e.preventDefault()
    console.log("Form Submitted: targetCategory = " + targetCategory )
    addTasks();
})



// Functions
function createTask(title, description, priority, deadline){
    const taskDiv = document.createElement('div')
    taskDiv.className = 'task'
    taskDiv.setAttribute("draggable", true)

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
    taskDeadline.classList.add('task-deadline')
    taskDeadline.innerHTML = `<i class="fa-regular fa-clock"></i> ${formattedDate}`

    taskInfoDiv.appendChild(taskTag)
    taskInfoDiv.appendChild(taskDeadline)

    taskDiv.appendChild(taskTitle)
    taskDiv.appendChild(taskDescription)
    taskDiv.appendChild(taskInfoDiv)

    taskDiv.addEventListener('dragstart', () => {
        taskDiv.classList.add('dragging')
        draggedTask = taskDiv; 
    })

    taskDiv.addEventListener('dragend', () => {
        taskDiv.classList.remove('dragging')
        draggedTask = null
    })

    return taskDiv
}

function clearForm(){
    titleInput.value = "";
    descInput.value = "";
    priorityInput.value = "Low";
    dateInput.value = "";
    overScreen.classList.toggle('hidden');
    popupForm.classList.toggle('hidden');
}

function addTasks(){
    const title = titleInput.value;
    const description = descInput.value;
    const priority = priorityInput.value;
    const deadline = dateInput.value;

    const task = createTask(title, description, priority, deadline)
    targetCategory.appendChild(task)
    updateEmptyStates()
    clearForm()
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
