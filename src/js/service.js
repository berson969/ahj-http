// const TICKET_BASE_URL = 'https://ahj-live-dnd-http.onrender.com'
const TICKET_BASE_URL = "/";

// XMLHttpRequest -- старый -- axios
// Fetch API -- без библиотек
// axios --- / got / ofetch / ...

// ссылок --- new URL

export class TicketService {
  static async create(newTicket) {
    const response = await fetch(`${TICKET_BASE_URL}/?method=createTicket`, {
      method: "POST",
      body: JSON.stringify(newTicket),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json(); // -> response.text() -> JSON.parse(text)
  }

  static async update(ticket) {
    const url = new URL(TICKET_BASE_URL);
    url.searchParams.append("method", "updateTicket");
    url.searchParams.append("id", ticket.id); // экранизируются

    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(ticket),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }

  static async delete(ticketId) {
    const url = new URL(TICKET_BASE_URL);
    url.searchParams.append("method", "deleteTicket");
    url.searchParams.append("id", ticketId); // экранизируются
    return await fetch(url, {
      method: "DELETE",
    });
  }

  static async get(ticketId) {
    const url = new URL(TICKET_BASE_URL);
    url.searchParams.append("method", "ticketById");
    url.searchParams.append("id", ticketId); // экранизируются
    const response = await fetch(url);
    return await response.json();
  }

  static async all() {
    const url = new URL(TICKET_BASE_URL);
    // SearchParams
    url.searchParams.append("method", "allTickets");
    const response = await fetch(url);
    return await response.json();
  }
}
