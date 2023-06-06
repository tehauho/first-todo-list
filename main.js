const form = document.getElementById("form");
const textInput = document.getElementById("textInput");
const msg = document.getElementById("msg");
const dateInput = document.getElementById("dateInput");
const textarea = document.getElementById("textarea");
const tasks = document.getElementById("tasks");
const add = document.getElementById("add");
const timeInput = document.getElementById("timeInput");
const dateMsg = document.getElementById("dateMsg");
const timeMsg = document.getElementById("timeMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

const formValidation = () => {
  if (textInput.value === "") {
    msg.innerHTML = "Task cannot be blank";
  } else if (dateInput.value === "") {
    dateMsg.innerHTML = "Date cannot be blank";
  } else if (timeInput.value === "") {
    timeMsg.innerHTML = "Time cannot be blank";
  } else {
    msg.innerHTML = "";
    dateMsg.innerHTML = "";
    timeMsg.innerHTML = "";
    acceptData();
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();

    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  }
};

let data = [];

const acceptData = () => {
  data.push({
    text: textInput.value,
    date: dateInput.value,
    time: timeInput.value,
    description: textarea.value,
  });

  localStorage.setItem("data", JSON.stringify(data));

  createTask();
};

const createTask = () => {
  tasks.innerHTML = "";
  data.map((item, index) => {
    return (tasks.innerHTML += `
    <div class="showTaskDiv" id="${index}">
            <span class="fw-bold">${item.text}</span>
            <p>${item.description}</p>
            <span class="small text-secondary">${item.date}  ${item.time}</span>
            <span class="options">
              <i data-id=${index} onclick="doneTask(this)" class="fa-solid fa-square-check"></i>
              <i onclick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fa-solid fa-pen-to-square"></i>
              <i onclick="deleteTask(this);createTask()" class="fa-solid fa-trash"></i>

            </span>
          </div>`);
  });

  resetForm();
};

const doneTask = (e) => {
  const taskDiv = e.parentElement.parentElement;
  const spanElement = taskDiv.querySelector("span.fw-bold");
  const idx = taskDiv.id;
  const taskData = data[idx];

  // trying to stick the checked item after refresh
  if (taskData.status === "done") {
    taskData.status = "undone";
    spanElement.style.textDecoration = "none";
    e.parentElement.parentElement.style.background = "#b8b08d";
  } else {
    taskData.status = "done";
    spanElement.style.textDecoration = "line-through";
    e.parentElement.parentElement.style.background = "rgba(242, 149, 89, 1)";
  }
  localStorage.setItem("data", JSON.stringify(data));
};

const deleteTask = (e) => {
  e.parentElement.parentElement.remove();
  data.splice(e.parentElement.parentElement.id, 1);
  localStorage.setItem("data", JSON.stringify(data));
};

const editTask = (e) => {
  const editBtn = e.parentElement.parentElement;

  textInput.value = editBtn.children[0].innerHTML;
  textarea.value = editBtn.children[1].innerHTML;
  dateInput.value = editBtn.children[2].innerHTML;
  timeInput.value = editBtn.children[3].innerHTML;

  deleteTask(e);
};

const resetForm = () => {
  textInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
  textarea.value = "";
};

(() => {
  data = JSON.parse(localStorage.getItem("data")) || [];
  createTask();
})();

const currentDate = new Date();

const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
const year = currentDate.getFullYear();
const day = currentDate.getDate().toString().padStart(2, "0");
const formattedDate = year + "-" + month + "-" + day;

document.getElementById("dateInput").min = formattedDate;
