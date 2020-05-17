import { Todo } from './types.ts';
import { assertEquals, assert } from "https://deno.land/std/testing/asserts.ts";

const test = {
    text: 'end to end test',
    done: false
};

const ROOT = 'http://localhost:8080/todos';

const firstTodos = await fetch(ROOT)
    .then(d => d.text())
    .then(t => JSON.parse(t));
console.log(firstTodos);

Deno.test({
    name: 'GET todos',
    fn(): void {
        assertEquals(firstTodos.data.length, 2);
    }
})

await fetch(ROOT, { 
    method: 'POST',
    body: JSON.stringify(test),
    headers: {
        'Content-Type': 'application/json'
    }
});

const secondTodos = await fetch(ROOT)
    .then(d => d.text())
    .then(t => JSON.parse(t));
console.log('===After POST===');
console.log(secondTodos);

Deno.test({
    name: 'POST todo',
    fn(): void {
        assertEquals(secondTodos.data.length, 3);
    }
});

const myTodo: Todo = secondTodos.data.find((t: Todo) => t.text === test.text) || {};

Deno.test({
    name: 'POST todo: returns the ID',
    fn(): void {
        assert(myTodo.id || Number.MIN_SAFE_INTEGER > firstTodos.data.map((t: Todo) => t.id).sort().reverse()[0]);
    }
});

myTodo.done = true;

await fetch(`${ROOT}/${myTodo.id}`, { 
    method: 'PUT',
    body: JSON.stringify(myTodo),
    headers: {
        'Content-Type': 'application/json'
    }
});

const thirdTodos = await fetch(ROOT)
    .then(d => d.text())
    .then(t => JSON.parse(t));
console.log('===After Update===');
console.log(thirdTodos);

Deno.test({
    name: 'PUT todo',
    fn(): void {
        const updatedTodo: Todo = thirdTodos.data.find((t: Todo) => t.id === myTodo.id);
        assertEquals(updatedTodo.done, true);
    }
});

await fetch(`${ROOT}/${myTodo.id}`, { 
    method: 'DELETE',
});

const finalTodos = await fetch(ROOT)
    .then(d => d.text())
    .then(t => JSON.parse(t));
console.log('===After Delete===');
console.log(finalTodos);

Deno.test({
    name: 'PUT todo',
    fn(): void {
        const updatedTodo: Todo = finalTodos.data.find((t: Todo) => t.id === myTodo.id);
        assertEquals(updatedTodo, undefined);
        assertEquals(finalTodos.length, firstTodos.length);
    }
});