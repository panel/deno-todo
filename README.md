# deno todo

The canonical example of a new webservice. This is implemented
on [deno](https://deno.land) using the [oak](https://github.com/oakserver/oak)
webservice framework.

## installation

`deno` dynamically downloads and installs dependencies, so all
you need to do is install deno itself. There's docs on their 
site that [explain installation](https://deno.land/#installation).

I installed it on OSX using [homebrew](https://brew.sh/) with the following
command:

```sh
$> brew install deno
$> deno --version
deno 1.0.0
v8 8.4.300
typescript 3.9.2
```
## running

In order to start the server, you just need to run the [server.ts](./server.ts)
script. Since `deno` requires you to explicity grant permissions for
different actions, you'll need to pass a couple flags for it to work:

```sh
$ deno run --allow-net --allow-write --allow-read server.ts
```

or, more dangerously:

```sh
$ deno run -A server.ts
```

The server will then be available at [http://localhost:8080](http://localhost:8080).

## tests

There's a simple e2e test that runs that exercises the 4 endpoints made
available. First, make sure you have the the server above runing. Secondly,
make sure you haven't modfied [todos.json](./todos.json). Finally, you can
execute them using `deno`'s built in test runner:

```sh
$> deno test --allow-net test.ts
unning 5 tests
test GET todos ... ok (2ms)
test POST todo ... ok (2ms)
test POST todo: returns the ID ... ok (0ms)
test PUT todo ... ok (1ms)
test PUT todo ... ok (0ms)

test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (7ms)
```