import { Todo } from './types.ts';

const test = {
    text: 'end to end test',
    done: false
};

const ROOT = 'http://localhost:8080/todos';

const firstTodos = await fetch(ROOT)
    .then(d => d.text())
    .then(t => JSON.parse(t));
console.log(firstTodos);

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

const myTodo: Todo = secondTodos.data.find((t: Todo) => t.text === test.text);

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

await fetch(`${ROOT}/${myTodo.id}`, { 
    method: 'DELETE',
});

const finalTodos = await fetch(ROOT)
    .then(d => d.text())
    .then(t => JSON.parse(t));
console.log('===After Delete===');
console.log(finalTodos);