import { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";
import DataStore from './ds.ts';
import { Todo } from "./types.ts";

const ds = new DataStore();
const router = new Router();

router
    .get('/todos', ctx => { 
        ctx.response.body = { data: ds.getTodos() } 
    })
    .get('/todos/:id', ctx => {
        if (ctx.params.id === undefined) {
            ctx.response.status = 400
            ctx.response.body = { err: 'you must provide an id' };
            return;
        }

        const id = parseInt(ctx.params.id, 10);
        const todo = ds.getTodos().filter(t => t.id === id);

        if (todo.length) {
            ctx.response.body = { data: todo[0] }
        } else {
            ctx.response.status = 404;
        }
    })
    .delete('/todos/:id', ctx => {
        if (ctx.params.id === undefined) {
            ctx.response.status = 400
            ctx.response.body = { err: 'you must provide an id' };
            return;
        }

        const id = parseInt(ctx.params.id, 10);
        const todo = ds.getTodos().find(t => t.id === id);
        if (todo) {
            ds.deleteTodo(todo);
            ctx.response.status = 204;
        } else {
            ctx.response.status = 404;
        }
    })
    .put('/todos/:id', async ctx => {
        const { value }: any = await ctx.request.body();
        const todo: Todo = {
            id: value.id,
            text: value.text,
            done: value.done
        };

        if (todo.id === undefined || ctx.params.id === undefined) {
            ctx.response.status = 400;
            return;
        }

        if (todo.id !== parseInt(ctx.params.id, 10)) {
            ctx.response.status = 400;
            return;
        }

        ds.updateTodo(todo);

        ctx.response.status = 200;
        ctx.response.body = { data: todo };
    })
    .post('/todos', async ctx => {
        const { value }: any = await ctx.request.body();
        if (value.id !== undefined) {
            ctx.response.status = 400;
            ctx.response.body = { msg: 'you cannot specify an id' };
            return;
        }

        const todo: Todo = {
            text: value.text,
            done: value.done
        };
        const updated = ds.addTodo(todo);

        ctx.response.status = 201;
        ctx.response.body = { data: updated };
    });

export default router;