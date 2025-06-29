const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

let lastDeleted = null;
let undoTimeout = null;

addBtn.addEventListener('click', ()=>{
    const task = input.value.trim();
    if (task==="") return;

    const taskDiv = document.createElement("div");
    taskDiv.classList.add('task-item');

    const tickBtn = document.createElement("button");
    tickBtn.innerHTML = "✔️";
    tickBtn.className = "tick-btn";
    
    const taskText = document.createElement("span");
    taskText.textContent = task;
    taskText.className = "task-text";
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "🗑️";
    deleteBtn.classList.add('delete-btn');

    taskDiv.appendChild(tickBtn);
    taskDiv.appendChild(taskText);
    taskDiv.appendChild(deleteBtn);
    taskList.appendChild(taskDiv);
    
    input.value = "";

    tickBtn.addEventListener("click", ()=> {
        taskText.classList.toggle('completed');
        tickBtn.classList.toggle('active');
    });

    
    deleteBtn.addEventListener('click', ()=>{
        lastDeleted = taskDiv;
        taskDiv.remove();
        
        const undoCont = document.getElementById("undo-container");
        undoCont.style.display = "block";
        
        undoTimeout = setTimeout(() => {
            undoCont.style.display = "none";
            lastDeleted = null;
        }, 3000);
    });
});

document.getElementById("undo-btn").addEventListener("click", () => {
    if (lastDeleted){
        taskList.appendChild(lastDeleted);
        lastDeleted =  null;
    }

    document.getElementById("undo-container").style.display = "none";
    clearTimeout(undoTimeout);
});
