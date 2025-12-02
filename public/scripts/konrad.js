async function displayTasks() {
    const response = await fetch("/getTasks");
    const tasks = response.json();

}