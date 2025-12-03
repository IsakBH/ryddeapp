const task_list = document.getElementById('documentsList');
async function displayTasks() {
    const response = await fetch("/getTasks");
    const tasks = response.json();
    console.log(tasks);

    for (let task of tasks) {
        const task_div = document.createElement("div");
        console.log("laget divs")
        task_div.dataset.taskid = task.id;
        const nameSpan = document.createElement("span");
        console.log("laget span element")
        /*const descrSpan = document.createElement("span");
        const creatorSpan = document.createElement("span");*/
        nameSpan.classList.add("task-name");
        console.log("laget til class")
        /*descrSpan.classList.add("task-description");
        creatorSpan.classList.add("creator-name");*/
        task_div.addEventListener("click", slettOppgave);
        console.log("laget til eventlistener");

        nameSpan.textContent = task.name;
        /*descrSpan.textContent = task.description;
        creatorSpan.textContent = "Laget av: " + task.creatorUser;*/
        div.appendChild(nameSpan);
        /*div.appendChild(document.createElement("br"));
        div.appendChild(creatorSpan);
        div.appendChild(document.createElement("br"));
        div.appendChild(descrSpan);*/

        task_list.appendChild(task_div);
    }
}

function initializer() {
    console.log("kjører displayTasks() funksjon...");
    displayTasks();
    console.log("displayTasks() funksjon er kjørt!");
}

window.onload = initializer();