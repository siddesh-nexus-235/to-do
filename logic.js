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
    
    taskText.addEventListener("dblclick", () => {
        const newText = prompt("Edit task:", taskText.textContent);
        if (newText !== null && newText.trim() !== ""){
            taskText.textContent = newText.trim();
            saveTasksToLocal();
        }
    });
    
    const timerSpan = document.createElement("span");
    timerSpan.className = "task-timer";
    
    const timerBtn = document.createElement("button");
    timerBtn.textContent = "⌛";
    timerBtn.className = "timer-btn";
    timerBtn.title = "Set timer";
    
    const timerWrapper = document.createElement("div");
    timerWrapper.style.display = "flex";
    timerWrapper.style.alignItems = "center";
    timerWrapper.style.gap = "3px";
    timerWrapper.style.marginLeft = "auto";
    timerWrapper.appendChild(timerBtn);
    timerWrapper.appendChild(timerSpan);

    timerBtn.addEventListener("click", () => {
        const choice = prompt("Choose:\n1 = Set/Update Timer\n2 = Delete TImer");
        
        if (choice === "1"){
            const mins = prompt("Enter time in minutes:");
            const duration = parseInt(mins)*60;

            if(!isNaN(duration) && duration>0){
                startCountdown(duration, timerSpan);
            }
            else {
                alert("Please enter a valid number.");
            }
        }
        else if (choice === "2"){
            timerSpan.textContent = "";
            timerSpan.style.color = "";
        }
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "🗑️";
    deleteBtn.classList.add('delete-btn');

    taskDiv.appendChild(tickBtn);
    taskDiv.appendChild(taskText);
    taskDiv.appendChild(timerWrapper);
    taskDiv.appendChild(deleteBtn);
    const li = document.createElement("li");
    li.appendChild(taskDiv);
    taskList.appendChild(li);
    
    input.value = "";

    tickBtn.addEventListener("click", ()=> {
        taskText.classList.toggle('completed');
        tickBtn.classList.toggle('active');
        saveTasksToLocal();
    });

    
    deleteBtn.addEventListener('click', ()=> {
        const li = taskDiv.parentElement;
        lastDeleted = li;
        li.remove();
        
        const undoCont = document.getElementById("undo-container");
        undoCont.style.display = "block";
        
        undoTimeout = setTimeout(() => {
            undoCont.style.display = "none";
            lastDeleted = null;
        }, 3000);
        saveTasksToLocal();
    });

});

document.getElementById("undo-btn").addEventListener("click", () => {
    if (lastDeleted){
        taskList.appendChild(lastDeleted);
        lastDeleted =  null;
        saveTasksToLocal();
    }

    document.getElementById("undo-container").style.display = "none";
    clearTimeout(undoTimeout);
});

function startCountdown(duration, display) {
    let timer = duration;
    const interval = setInterval(()=> {
        let minutes = Math.floor(timer/60);
        let seconds = timer%60;

        display.textContent = `${minutes}:${seconds<10 ? "0" + seconds: seconds}`;

        if (--timer < 0){
            clearInterval(interval);
            display.textContent = "⏰ Time's up!";
            display.style.color = "red";
        }
    }, 1000);
}

function saveTasksToLocal(){
    const tasks = [];

    document.querySelectorAll(".task-item").forEach(task =>{
        const text = task.querySelector(".task-text").textContent;
        const isDone = task.querySelector(".task-text").classList.contains("completed");
        tasks.push({text, isDone});
    })

    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

window.addEventListener("load", () => {
    const stored = localStorage.getItem("todoTasks");
    if (stored) {
        JSON.parse(stored).forEach(task => {
            input.value = task.text;
            addBtn.click();
            const lastTask = taskList.lastChild;
            if (task.isDone) {
                lastTask.querySelector(".task-text").classList.add("completed");
                lastTask.querySelector(".tick-btn").classList.add("active");
            }
        });
    }
});


input.addEventListener("keydown", (e) => {
    if (e.key === "Enter"){
        addBtn.click();
    }
});

new Sortable(document.getElementById("task-list"),{
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd: () => {
        saveTasksToLocal();
    }
});

