const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

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

    deleteBtn.addEventListener('click', ()=>{
        taskDiv.remove();
    });

    tickBtn.addEventListener("click", ()=> {
        taskText.classList.toggle('conpleted');
    });
});