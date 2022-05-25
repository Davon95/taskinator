var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    formEl.reset();
    var isEdit = formEl.hasAttribute("data-task-id");
    // Package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };
    // Send it as an arguement to createTaskEl
    // Had data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // No data attribute, so create object as normal and pass to createTaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do",
        };
        createTaskEl(taskDataObj);
    }
};



var createTaskEl = function (taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);
    // Add entire list item to list
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    tasksToDoEl.appendChild(listItemEl);
    tasksToDoEl.appendChild(listItemEl);
    taskIdCounter++;
    saveTasks()
    loadTasks()
};

var createTaskActions = function (taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    // Create Edit Button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);
    // Create Delete Button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);
    // Create Select
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(statusSelectEl);
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        // Crate option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        // Append To Select
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function (event) {
    // Get target element from event
    var targetEl = event.target;
    // Edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    // Delete button was clicked
    else if (event.target.matches(".delete-btn")) {
        // Get the element's task id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var deleteTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    // Create new array to hold updated list of tasks
    var updatedTaskArr = [];
    // Loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // If tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new arry
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
        // Reassign tasks array to be the same as updatedTaskArr
        tasks = updatedTaskArr;
    }
    saveTasks()
};

var editTask = function (taskId) {
    // Get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
}

var completeEditTask = function (taskName, taskType, taskId) {
    // Find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // Set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].name = taskType;
        }
    };
    saveTasks()
    loadTasks()
    alert("Task Updated");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var taskStatusChangeHandler = function (event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");
    // Get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    // Find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
    // Update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks()
    loadTasks()
};
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
    localStorage.getItem("tasks");
    
    //debugger;
    if (tasks === null) {
        return false;
    };
    for (var i = 0; i < tasks.length; i++) {
    JSON.parse(JSON.stringify(tasks));
    }
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", tasks[i].id);
    var taskInfoEl = document.createElement("div")
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
    tasks[i].id = taskIdCounter;
    listItemEl.appendChild(taskInfoEl);
    var taskActionsEl = createTaskActions(tasks[i].id)
    listItemEl.appendChild(taskActionsEl);
    console.log(listItemEl);
    var taskActionsEl = createTaskActions(tasks[i].id);
    listItemEl.appendChild(taskActionsEl);
    if (tasks[i].status === "To Do") {
        listItemEl.querySelector("select[name='status-change']").selectedIndex
        tasksToDoEl.appendChild(listItemEl);
    }
    else if (tasks[i].status === "In Progress") {
        listItemEl.querySelector("select[name='status-change']").selectedIndex
        tasksInProgressEl.appendChild(listItemEl);
    }
    else if (tasks[i].status === "Complete") {
        listItemEl.querySelector("select[name='status-change']").selectedIndex
        tasksCompletedEl.appendChild(listItemEl);
    }
    console.log(listItemEl);
}

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);