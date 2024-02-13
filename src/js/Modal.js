import { TicketService } from "./service";

/* eslint-disable no-undef, no-async-promise-executor */
export default class Modal {
  constructor(element) {
    this.element = element;
    this.content = {
      create: {
        title: "Добавить тикет",
        name: "Краткое описание",
        description: "Подробное описание",
      },
      edit: {
        title: "Изменить тикет",
        name: "Краткое описание",
        description: "Подробное описание",
      },
      delete: {
        title: "Удалить тикет",
        description:
          "Вы уверены, что хотите удалить тикет? Это действие необратимо",
      },
    };
  }

  innerModal(data) {
    return `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${data.title}</h5>
                </div>
                <div class="modal-body">
                    <p>${data.description}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="ok">Ok</button>
                    <button type="button" class="btn btn-secondary order-first close" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>`;
  }

  createForm() {
    const modalBody = this.element.querySelector(".modal-body");
    modalBody.innerHTML = "";
    const form = document.createElement("form");
    form.innerHTML = `
        <div class="mb-3">
            <label for="shortDescription" class="form-label">Краткое описание</label>
            <input type="text" class="form-control" id="short">
        </div>
        <div class="mb-3">
            <label for="detailedDescription" class="form-label">Подробное описание</label>
            <textarea class="form-control" id="detailed" rows="4"></textarea>
        </div>`;
    modalBody.appendChild(form);
    return modalBody;
  }

  renderModal(content) {
    const modal = document.createElement("div");
    modal.classList.add("modal", "d-block");
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("role", "dialog");
    modal.innerHTML = this.innerModal(content);

    this.element.appendChild(modal);
    return modal;
  }

  clearModal() {
    this.element.innerHTML = "";
  }

  renderCreateModal = async () => {
    return new Promise((resolve) => {
      const modal = this.renderModal(this.content.create);
      this.createForm();

      const buttons = modal.querySelectorAll("button");
      buttons.forEach((button) => {
        button.addEventListener("click", async (event) => {
          event.preventDefault();

          if (event.target.id === "ok") {
            const currentTimeStamp = new Date().getTime();
            const name = document.getElementById("short").value;
            const description = document.getElementById("detailed").value;

            const ticket = {
              name,
              description,
              status: false,
              created: currentTimeStamp,
            };

            await TicketService.create(ticket).then((data) => {
              console.log("Тикет создан", data);
            });
          } else if (event.target.classList.contains("close")) {
            console.log(event.target);
          }
          modal.classList.remove("d-block");
          this.clearModal();
          resolve();
        });
      });
    });
  };

  renderEditModal = async (id) => {
    return new Promise(async (resolve) => {
      const modal = this.renderModal(this.content.edit);
      const modalBody = this.createForm();
      const oldTicket = await TicketService.get(id);

      modalBody.querySelector("#short").value = oldTicket.name;
      modalBody.querySelector("#detailed").value = oldTicket.description;

      const buttons = modal.querySelectorAll("button");
      buttons.forEach((button) => {
        button.addEventListener("click", async (event) => {
          event.preventDefault();
          console.log(event.target);

          if (event.target.id === "ok") {
            const name = document.getElementById("short").value;
            const description = document.getElementById("detailed").value;
            console.log("name", name, description);

            const ticket = {
              id,
              name,
              description,
            };

            await TicketService.update(ticket).then((data) => {
              console.log("Тикет изменен", data);
            });
          } else if (event.target.classList.contains("close")) {
            console.log(event.target);
          }
          modal.classList.remove("d-block");
          this.clearModal();
          resolve();
        });
      });
    });
  };

  renderDeleteModal(id) {
    return new Promise(async (resolve) => {
      const modal = this.renderModal(this.content.delete);
      const buttons = modal.querySelectorAll("button");
      buttons.forEach((button) => {
        button.addEventListener("click", async (event) => {
          if (event.target.id === "ok") {
            await TicketService.delete(id);
          } else if (event.target.classList.contains("close")) {
            console.log(event.target);
          }
          modal.classList.remove("d-block");
          this.clearModal();
          resolve();
        });
      });
    });
  }
}
