import Koa from 'koa'
import { koaBody } from 'koa-body'
import Router from '@koa/router'
import cors from '@koa/cors';
import ticketRepository  from './TicketRepository.js'

const router = new Router()
const app = new Koa()
app
    .use(cors())
    .use(koaBody())
    .use(router.routes())
    .use(router.allowedMethods())


router.get('/', (ctx) => {
    switch (ctx.request.query.method) {
        case 'allTickets':
            ctx.body = ticketRepository.find()
            break;
        case 'ticketById':
            ctx.body = ticketRepository.findOne(ctx.request.query.id)
            break;
        default:
            ctx.throw(404, 'not found');
    }
})

router.post('/', (ctx) => {
    switch (ctx.request.query.method) {
        case 'createTicket':
            ctx.body = ticketRepository.create(ctx.request.body)
            break;
        case 'updateTicket':
            ctx.body = ticketRepository.update(ctx.request.query.id, ctx.request.body)
            break;
        default:
            ctx.throw(404, 'not found');
    }
})

router.patch('/', (ctx) => {
    switch (ctx.request.query.method) {
        case 'updateTicket':
            ctx.body = ticketRepository.update(ctx.request.query.id, ctx.request.body)
            break;
        default:
            ctx.throw(404, 'not found');
    }
})



router.delete('/', (ctx) => {
    switch (ctx.request.query.method) {
        case 'deleteTicket':
            ticketRepository.delete(ctx.request.query.id)
            ctx.body = { status: 'ok' }
            break;
        default:
            ctx.throw(404, 'not found');
    }
})

const PORT = process.env.PORT || 7071
app.listen(PORT, () => {
    console.log(`Open http://localhost:${PORT}`)
})
