const task_list = document.getElementById('documentsList');
const task_input = document.getElementById('text-input');
const task_name_el = document.getElementById('task-name');
const task_description_el = document.getElementById('task-description');
const task_difficulty_el = document.getElementById('task-difficulty');
const task_completion_status_el = document.getElementById('task-completion-status');
const task_creator_el = document.getElementById('task-creator');

async function deleteTask(e) {
    console.log("deleting task", e)
    const deleteTask = await fetch("/deleteTask", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: e.target.dataset.taskid })
    })
    displayTasks();
}

async function loadTask(id) {
    document.querySelectorAll('#documentsList .task').forEach(task => {
        task.classList.remove('active-task');
    });

    const activeTask = document.querySelector(`#documentsList div.task[data-taskid="${id}"]`);

    if (activeTask) {
        activeTask.classList.add('active-task');
    }

    const response = await fetch(`/getTask?id=${id}`);
    console.log("tuff response");
    const task = await response.json();
    console.log(task);

    task_name_el.textContent = 'Oppgavenavn: ' + task.name;
    task_description_el.textContent = 'Oppgavebeskrivelse: ' + task.description;
    task_difficulty_el.textContent = 'Vanskelighetsgrad: ' + task.difficulty;
    task_completion_status_el.textContent = 'Fullføringsstatus: ' + task.completed;
    task_creator_el.textContent = 'Oppgavemester: ' + task.creatorUser;
}

async function displayTasks() {
    const response = await fetch("/getTasks");
    const tasks = await response.json();
    task_list.textContent = "";

    for (let task of tasks) {
        const task_div = document.createElement("div");
        console.log("laget divs")
        const delete_button = document.createElement("button");
        delete_button.innerHTML = '<i class="fa-solid fa-trash"></i>'
        delete_button.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(e);
        })

        task_div.dataset.taskid = task.id;
        task_div.setAttribute("id", task.id);
        delete_button.dataset.taskid = task.id

        const nameSpan = document.createElement("span");

        console.log("laget span element")
        task_div.classList.add("task");
        nameSpan.classList.add("task-name");
        console.log("laget til class")

        task_div.addEventListener("click", () => loadTask(task.id));

        console.log("lagt til eventlistener");

        nameSpan.textContent = task.name;
        task_div.appendChild(nameSpan);
        task_div.appendChild(delete_button);

        task_list.appendChild(task_div);

        /*
        <div class="document-actions">
            <button id="shareButton" onclick="shareDocument(${doc.id})" title="Del dokument">
                <i class="fa-solid fa-share"></i>
            </button>
            <button onclick="deleteDocument(${doc.id})" title="Slett dokument">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        */
    }
}

function initializer() {
    console.log("kjører displayTasks() funksjon...");
    displayTasks();
    console.log("displayTasks() funksjon er kjørt!");
}

window.onload = initializer();