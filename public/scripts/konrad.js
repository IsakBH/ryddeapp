const task_list = document.getElementById('documentsList');
const task_input = document.getElementById('text-input');
const task_name_el = document.getElementById('task-name');
const task_description_el = document.getElementById('task-description');
const task_difficulty_el = document.getElementById('task-difficulty');
const task_completion_status_el = document.getElementById('task-completion-status');
const task_creator_el = document.getElementById('task-creator');
const new_task_button = document.getElementById('newDocument');
const leaderboard_list = document.getElementById('leaderboardList');
const leaderboard_search = document.getElementById('leaderboardSearch');
const menuToggle = document.querySelector('.menu-toggle');
const documentManager = document.querySelector('.document-manager')
const menuToggleRight = document.querySelector('.menu-toggle-right');
const leaderboard = document.querySelector('.leaderboard');


// createTask() form inputs
const task_name_input = document.getElementById('task-name-input');
const task_description_input = document.getElementById('task-description-input');
const task_creator_dropdown = document.getElementById('task-creator-dropdown');
const task_difficulty_dropdown = document.getElementById('task-difficulty-dropdown');
const create_task_dialog = document.getElementById('create-task-dialog');
const create_task_form = document.getElementById('create-task-form');
const cancel_create_task_button = document.getElementById('cancel-create-task')

menuToggle.addEventListener('click', () => {
    documentManager.classList.toggle('active');
});

menuToggleRight.addEventListener('click', () => {
    leaderboard.classList.toggle('active');
});

async function completeTask(e) {
    e.preventDefault();
    console.log("jeg har gjort denne oppgaven!");
    username = prompt("Hva heter du?");

    if (!username) return; // hvis brukeren er tullete og ombestemmer seg så ikke gjør shit

    const completeTask = await fetch("/completeTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: e.target.dataset.taskid, username }),
    });

    displayTasks();
    displayLeaderboard();
}


new_task_button.addEventListener('click', () => {
    create_task_dialog.showModal();
})

cancel_create_task_button.addEventListener('click', () => {
    create_task_dialog.close();
})

create_task_form.addEventListener('submit', (e) => {
    createTask(e);
})

async function createTask(e) {
    e.preventDefault();
    const task_name = task_name_input.value.trim();
    const task_description = task_description_input.value.trim();
    const task_creator = task_creator_dropdown.value.trim();
    const task_difficulty = task_difficulty_dropdown.value.trim();
    const response = await fetch("/createTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            task_name,
            task_description,
            task_creator,
            task_difficulty
        })
    })
    if (response.ok){
        create_task_dialog.close();
        displayTasks();
    } else {
        console.error("kunne ikke lage task :( tror noe er feil")
    }
}

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
    //console.log(task);

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
        //console.log("laget divs")
        const delete_button = document.createElement("button");
        delete_button.innerHTML = '<i class="fa-solid fa-trash"></i>'
        delete_button.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(e);
        })

        const complete_button = document.createElement("button");
        complete_button.innerHTML = '<i class="fa-solid fa-check"></i>';
        complete_button.addEventListener('click', (e) => {
            e.stopPropagation();
            completeTask(e);
        })

        task_div.dataset.taskid = task.id;
        task_div.setAttribute("id", task.id);
        delete_button.dataset.taskid = task.id;
        complete_button.dataset.taskid = task.id;

        delete_button.classList.add("document-actions");
        complete_button.classList.add("document-actions");

        const nameSpan = document.createElement("span");

        //console.log("laget span element")
        task_div.classList.add("task");

        nameSpan.classList.add("task-name");
        //console.log("laget til class")

        task_div.addEventListener("click", () => loadTask(task.id));

        //console.log("lagt til eventlistener");

        nameSpan.textContent = task.name;
        task_div.appendChild(nameSpan);
        if (task.completed) {
            task_div.classList.add("completed-task");
        } else {
            task_div.appendChild(complete_button);
            task_div.appendChild(delete_button);
        }

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


async function displayLeaderboard() {
    const response = await fetch("/getLeaderboard");
    const leaderboardData = await response.json();
    leaderboard_list.innerHTML = ""; // fjernet alt dritet som var der før

    if (leaderboardData.length === 0) {
        leaderboard_list.innerHTML = '<li style="text-align: center; color: #666; padding: 20px;">Umm, bro? Hvorfor prøver du å vise noe når det ikke er noe her????</li>';
        return;
    }

    // det faktiske leaderboardet (det som er i)
    leaderboardData.forEach((user, index) => {
        const user_li = document.createElement("li");
        user_li.classList.add("leaderboard-item");

        user_li.innerHTML = `
            <div class="user">
                <span class="rank">${index + 1}</span>
                <img src="/images/default.png" alt="Profilbilde" class="avatar">
                <span class="name">${user.completerUser}</span>
            </div>
            <span class="score">${user.score} poeng</span>
        `;
        leaderboard_list.appendChild(user_li);
    });
}

function initializer() {
    console.log("kjører displayTasks() funksjon...");
    displayTasks();
    console.log("displayTasks() funksjon er kjørt!");
    console.log("kjører displayLeaderboard() funksjon");
    displayLeaderboard();
    console.log("displayLeaderboard() funksjon er kjørt!");
}

window.onload = initializer();
