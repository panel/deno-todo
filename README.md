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
$ brew install deno
$ deno --version
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
$ deno test --allow-net test.ts
unning 5 tests
test GET todos ... ok (2ms)
test POST todo ... ok (2ms)
test POST todo: returns the ID ... ok (0ms)
test PUT todo ... ok (1ms)
test PUT todo ... ok (0ms)

test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (7ms)
```

## thoughts

Overall, it was suprisingly easy to get going with `deno` considering how new
the platform is. The biggest shift is moving away from a package manager. Just
importing files from remote locations is a wild departure from the `node` world.
For the most part, everything moves quickly enough that it's barely noticeable.
It'll be interesting to see how this potentially less centralized model will
work. Remote code execution is scary; however, browsers have been doing it for
years, and that is the permission model `deno` is based off of.

Around that, I'm curious how many people will just be default add the `-A` flag
to the `deno run` command, which entitles the script to all permissions. I could
easily see folks getting confused why their script isn't working and, after a
quick search, adding that flag.

I look forward to the future evolution of the standard library. I ran into some issues trying to use the `fs` module with typescript files. That lead to using
the built in `Deno` methods. On that note, having a standard library that is
written utilizing promises and async/await along with top level aysnc removes a
lot of the annoyances/complexity from writing small utility scripts.

The biggest annoyance to start was the delay compiling typescript. Start up with
a cached compliation is instantaneous, but can take a handful of seconds as all
the `.ts` files get sent through the standard `tsc`. There's notes in the 
[1.0 blog post](https://deno.land/v1#tsc-bottleneck) about a solution shifting
the type checking to Rust. Don't expect that any time soon.

I might look to use `deno` for scripting problems where I would normally reach
to `python`. I'll sometimes use `node` in these cases, but I find myself needing
to piece together a ton of small modules. Having the batteries included 
simplifies the cognitive load, and let's me stay focused on the problem.
