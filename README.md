# DOM Element Wrapper

[![npm](https://img.shields.io/npm/v/dom-element-wrapper.svg)](https://www.npmjs.com/package/dom-element-wrapper)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://github.com/mickaelvieira/dom-element-wrapper/blob/master/LICENSE.md)
[![Build Status](https://travis-ci.org/mickaelvieira/dom-element-wrapper.svg?branch=master)](https://travis-ci.org/mickaelvieira/dom-element-wrapper)
[![Coverage Status](https://coveralls.io/repos/github/mickaelvieira/dom-element-wrapper/badge.svg?branch=master)](https://coveralls.io/github/mickaelvieira/dom-element-wrapper?branch=master)

## Motivation

This thin wrapper aims to provide a friendlier interface when it comes to creating nodes using the DOM API.

If like me, you enjoy chaining stuff and you feel sad when you have to use the DOM API, this library is made for you!

## Limitation

The library relies on the [Proxy](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object which is not
yet supported by [all browsers](http://kangax.github.io/compat-table/es6/#Proxy) and cannot be [transpiled or polyfilled](https://babeljs.io/learn-es2015/#ecmascript-2015-features-proxies).

## Install

```sh
$ npm i --save dom-element-wrapper
```

or

```sh
$ yarn add dom-element-wrapper
```

## Usage

The DOM API is extremely verbose and the way it was designed makes it very difficult to keep your code concise.

For instance, adding a single node to an existing one.

```js
const element1 = document.querySelector(".my-container");
const element2 = document.createElement("div");
element2.id = "element-id";
element2.className = "css-class";

element1.appendChild(element2);
```

This can be replaced with the following syntax

```js
import { wrap } from "dom-element-wrapper";

let element = document.querySelector(".my-container");

element = wrap(element).append(
  wrap("div", {
    id: "element-id",
    className: "css-class"
  })
);
```

The cool thing is you still have access to the underlying node, so you can do something like this:

```js
import { wrap } from "dom-element-wrapper";

const nodes = wrap(element)
  .append(
    wrap("div", {
      id: "element-id",
      className: "css-class"
    })
  )
  .setAttribute("title", "Element's title")
  .addEventListener("mouseover", handler)
  .appendChild(document.createElement("div")).childNodes;
```

We are now able to chain the node's methods! Whoop Whoop!

You still have access to the element's properties, the only difference is: the proxy intercept "setters" methods that return a _relevant_ result cannot be chained (.i.e such as `querySelector`, `cloneNode`, etc...) as so for methods starting with `get` `has` or `is` however methods that returns _irrelevant_ results can be chained (.i.e such as `addEventListener`, `insertBefore`, `appendChild`, etc...).

> **What do I call `irrelevant` results?**
>
> For example, the method `appendChild` will return the appended node.
> Who cares really? This is typically what I call an `irrelevant` result.

But wait a minute, what if we want to build a DOM structure a bit more complicated?

Well for instance, instead of writing this:

```js
const element = document.createElement("div");
element.className = "nice-stuff";

const div = document.createElement("div");
const p = document.createElement("p");

p.appendChild(document.createTextNode("List of stuff"));
div.appendChild(p);

element.appendChild(div);

const ul = document.createElement("ul");

const entries = ["Stuff 1", "Stuff 2", "Stuff 3", "Stuff 4"];

entries.forEach(function(entry) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(entry));
  ul.appendChild(li);
});

element.appendChild(ul);

document.querySelector("body").appendChild(element);
```

you can simply write something like that:

```js
import { wrap } from "dom-element-wrapper";

const entries = ["Stuff 1", "Stuff 2", "Stuff 3", "Stuff 4"];
const items = entries.map(entry => wrap("li").append(entry));

const element = wrap("div", { className: "nice-stuff" })
  .append(
    wrap("div").append(wrap("p").append("List of stuff")),
    wrap("ul").append(...items)
  )
  .unwrap();

document.querySelector("body").appendChild(element);
```

Both will create the same result.

```html
<div class="nice-stuff">
  <div>
    <p>List of stuff</p>
  </div>
  <ul>
    <li>Stuff 1</li>
    <li>Stuff 2</li>
    <li>Stuff 3</li>
    <li>Stuff 4</li>
  </ul>
</div>
```

**So what is this `unwrap` method all about?**

When we wrap the DOM element by calling `wrap`, the element is being wrapped within a `proxy` object but if we try to append this proxy to a DOM element, it will fail. We need to revoke the proxy to reveal the underlying object, this is exactly what `unwrap` does.

It is worth noting that you only need to call `unwrap` when you need to pass the element to a method that expects a actual DOM element. If you only need to manipulate the element, unwrapping is not necessary.

## API

#### Create a wrapper

Create the node and wrap it

```js
const element = wrap("div", { id: "my-id" });
```

```html
<div id="my-id"></div>
```

Wrap an existing node

```js
const element = wrap(document.querySelector(".container"), {
  id: "my-id"
});
```

```html
<div class="container" id="my-id"></div>
```

#### Prepend/append nodes

```js
const element = wrap("div")
  .prepend(
    wrap("div", {
      id: "my-id"
    })
  )
  .prepend(
    wrap("div", {
      className: "my-style"
    })
  );
```

```html
<div>
  <div class="my-style"></div>
  <div id="my-id"></div>
</div>
```

```js
const element = wrap("div")
  .append(
    wrap("div", {
      id: "my-id"
    })
  )
  .append(
    wrap("div", {
      className: "my-style"
    })
  );
```

```html
<div>
  <div id="my-id"></div>
  <div class="my-style"></div>
</div>
```

#### Prepend/append text nodes

```js
const element = wrap("div")
  .prepend("world")
  .prepend(" ")
  .prepend("Hello");
```

```html
<div>
  Hello world
</div>
```

```js
const element = wrap("div")
  .append("Hello")
  .append(" ")
  .append("world");
```

```html
<div>
  Hello world
</div>
```

#### Prepend/append wrappers

```js
const element = wrap("div").prepend(wrap("h1"), wrap("h2"), wrap("p"));
```

```html
<div>
  <p></p>
  <h2></h2>
  <h1></h1>
</div>
```

```js
const element = wrap("div").append(wrap("h1"), wrap("h2"), wrap("p"));
```

```html
<div>
  <h1></h1>
  <h2></h2>
  <p></p>
</div>
```

#### Reveal underlying node

```js
const element = wrap("div").unwrap();
```

That's it!

## Contributing

Install the dependencies

```sh
$ make
```

Run the test suite

```sh
$ make test
```

Run the linter

```sh
$ make lint
```

Format the source code

```sh
$ make fmt
```
