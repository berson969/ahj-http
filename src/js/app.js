import { TicketService } from "./service";
import Modal from "./Modal";

const listGroup = document.querySelector(".list-group");
const modalDiv = document.querySelector(".modal-container");
const modalClass = new Modal(modalDiv);

function renderEl(ticket) {
  const listItem = document.createElement("li");
  listItem.classList.add("list-group-item", "d-flex");
  listItem.setAttribute("id", ticket.id);

  const statusIcon = document.createElement("div");

  statusIcon.setAttribute("data-stat", ticket.status);
  statusIcon.classList.add(
    "stat",
    "col-md-1",
    ticket.status ? "bi-check2-circle" : "bi-circle"
  );
  listItem.appendChild(statusIcon);

  const descriptionDiv = document.createElement("div");
  descriptionDiv.classList.add("col-md-5", "d-flex", "flex-column");

  const nameDiv = document.createElement("span");
  nameDiv.classList.add("name");
  nameDiv.textContent = ticket.name;
  descriptionDiv.appendChild(nameDiv);

  const fullDiv = document.createElement("span");
  fullDiv.classList.add("description", "d-none", "mt-4");
  fullDiv.textContent = ticket.description;
  descriptionDiv.appendChild(fullDiv);

  listItem.appendChild(descriptionDiv);

  const dateSpan = document.createElement("span");
  dateSpan.classList.add("col-md-2", "date");
  const createdAt = new Date(ticket.created);
  dateSpan.textContent = createdAt.toLocaleDateString("ru-Ru", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  listItem.appendChild(dateSpan);

  const timeSpan = document.createElement("span");
  timeSpan.classList.add("col-md-2", "time");
  timeSpan.textContent = `${createdAt
    .getHours()
    .toString()
    .padStart(2, "0")}:${createdAt.getMinutes().toString().padStart(2, "0")}`;
  listItem.appendChild(timeSpan);

  const editIcon = document.createElement("div");
  editIcon.classList.add("col-md-1");
  editIcon.innerHTML = `<i class="edit bi-pencil-square"></i>`;
  listItem.appendChild(editIcon);

  const deleteIcon = document.createElement("div");
  deleteIcon.classList.add("col-md-1");
  deleteIcon.innerHTML = `<i class="del bi-x-square"></i>`;
  listItem.appendChild(deleteIcon);

  return listItem;
}

function toggleStatus(targetEl) {
  const newStatus = targetEl.getAttribute("data-stat") === "false";

  const id = targetEl.closest(".list-group-item").id;
  TicketService.update({ id, status: newStatus }).then((data) => {
    console.log("Статус изменен", data);
  });

  targetEl.setAttribute("data-stat", newStatus);
  if (newStatus) {
    targetEl.classList.remove("bi-circle");
    targetEl.classList.add("bi-check2-circle");
  } else {
    targetEl.classList.remove("bi-check2-circle");
    targetEl.classList.add("bi-circle");
  }
}

function toggleDescription(targetEl) {
  const descriptionDiv = targetEl
    .closest(".list-group-item")
    .querySelector(".description");

  if (descriptionDiv.classList.contains("d-none")) {
    descriptionDiv.classList.remove("d-none");
  } else {
    descriptionDiv.classList.add("d-none");
  }
}

async function renderListGroup() {
  clearListGroup();
  const tickets = await TicketService.all();

  tickets.forEach((ticket) => {
    listGroup.appendChild(renderEl(ticket));
  });
}

function clearListGroup() {
  listGroup.innerHTML = "";
}

const fetchAllTickets = async () => {
  const listGroup = document.querySelector(".list-group");
  await renderListGroup();

  const btnCreateTicketEl = document.querySelector(
    '[data-method="createTicket"]'
  );

  btnCreateTicketEl.addEventListener("click", async () => {
    await modalClass.renderCreateModal();
    await renderListGroup();
  });

  listGroup.addEventListener("click", async (event) => {
    const targetEl = event.target;
    if (targetEl.classList.contains("stat")) {
      toggleStatus(targetEl);
    } else if (targetEl.matches(".name, .description, .date, .time")) {
      toggleDescription(targetEl);
    } else if (targetEl.classList.contains("edit")) {
      const id = targetEl.closest(".list-group-item").id;
      await modalClass.renderEditModal(id);
      await renderListGroup();
    } else if (targetEl.classList.contains("del")) {
      const id = targetEl.closest(".list-group-item").id;
      await modalClass.renderDeleteModal(id);
      await renderListGroup();
    }
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  await fetchAllTickets();
});
