import { Todo } from "./types.ts";

const filePath = './todos.json';

export default class DataStore {
    #path: string
    #todos: Array<Todo> = []
    #idx: number = -1

    constructor(path: string = filePath) {
        this.#path = path;
        
        try {
            Deno.statSync(filePath);
            this.refreshFromDisk();
        } catch (error) {
            Deno.writeTextFileSync(filePath, '[]');
        }        
    }

    private refreshFromDisk(): void {
        const fromDisk = Deno.readTextFileSync(this.#path);
        this.#todos = JSON.parse(fromDisk);
        const largest = this.#todos.map(t => t.id).sort().slice(-1);
        
        if (largest[0] !== undefined) {
            this.#idx = largest[0];
        }
    }

    private async flush(): Promise<void> {
        await Deno.writeTextFile(this.#path, JSON.stringify(this.#todos, null, 2));
    }

    private splice(todo: Todo, { remove = false } = {}): void {
        const target = this.#todos.findIndex(t => t.id === todo.id);
        if (remove) {
            this.#todos.splice(target, 1);
        } else {
            this.#todos.splice(target, 1, todo);
        }
    }

    addTodo(_todo: Todo): Todo {
        const todo: Todo = {
            id: ++this.#idx,
            ..._todo
        };

        this.#todos.push(todo);
        
        return todo;
    }

    deleteTodo(todo: Todo): void {
        this.splice(todo, { remove: true });
    }

    updateTodo(todo: Todo): void {
        this.splice(todo);
    }

    getTodos(): Array<Todo> {
        return this.#todos;
    }

    async save(): Promise<Array<Todo>> {
        await this.flush();
        return this.getTodos();
    }
} 
