import { v4 as uuidv4 } from 'uuid'

class TicketRepository {
    #tickets = []

    find () {
        return this.#tickets
    }

    findOne (id) {
        return this.#tickets.find(ticket => ticket.id === id)
    }

    create (newTicket) {
        const ticket = {
            ...newTicket,
            id: uuidv4()
        }
        this.#tickets.push(ticket)
        console.log(ticket)
        return ticket
    }

    update (id, oldTicket) {
        const ticketIndex = this.#tickets.findIndex(ticket => ticket.id === id)
        if (ticketIndex !== -1) {
            this.#tickets[ticketIndex] = {
                ...this.#tickets[ticketIndex],
                ...oldTicket,
                id
            }
        }
        return this.#tickets[ticketIndex]
    }

    delete (id) {
        this.#tickets = this.#tickets.filter(ticket => ticket.id !== id)
    }
}

const ticketRepository = new TicketRepository()

export default ticketRepository;
