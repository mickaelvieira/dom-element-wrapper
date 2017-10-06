# DOM Element Wrapper

[![npm](https://img.shields.io/npm/v/dom-element-wrapper.svg)](https://www.npmjs.com/package/dom-element-wrapper)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://github.com/mickaelvieira/dom-element-wrapper/blob/master/LICENSE.md)
[![Build Status](https://travis-ci.org/mickaelvieira/dom-element-wrapper.svg?branch=master)](https://travis-ci.org/mickaelvieira/dom-element-wrapper)
[![Coverage Status](https://coveralls.io/repos/github/mickaelvieira/dom-element-wrapper/badge.svg?branch=master)](https://coveralls.io/github/mickaelvieira/dom-element-wrapper?branch=master)

## Motivation

This thin wrapper aims to provide a friendlier interface when it comes to creating
nodes using the DOM API.


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

The DOM API is extremely verbose and because of the way it has been designed it makes it very difficult to keep your code concise.

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
let element = document.querySelector(".my-container");

element = wrap(element)
  .appendNode("div", {
    id: "element-id",
    className: "css-class"
  });
```

But the cool thing is you still have access to the underlying node, so you can do something like this:

```js
const nodes = wrap("div")
  .appendNode("div", {
    id: "element-id",
    className: "css-class"
  })
  .setAttribute("title", "Element's title")
  .addEventListener("mouseover", handler)
  .appendChild(document.createElement("div"))
  .childNodes;
```

So basically by wrapping the DOM element, we get back a DOM element on steroids.

You still have access to the element properties, the only difference is: methods that return a _relevant_ result cannot be chained (.i.e such as `querySelector`, `cloneNode`, etc...) however methods that returns _irrelevant_ results can be chained (.i.e such as `addEventListener`, `insertBefore`, `appendChild`, etc...).

> **NOTE: What do I call `irrelevant` results?**
>
> For example, a method such as `appendChild` will return the appended node. Who > cares really? This is typically what I call an `irrelevant` result.

But wait a minute, what if I want to build a DOM structure a bit more complicated you might ask.

Well for instance, instead of writing this:

```js
const element = document.createElement("div");
element.id = "element-id";

const div = document.createElement("div");
const p = document.createElement("p");

p.appendChild(document.createTextNode("Lorem ipsum"));
div.appendChild(p);

element.appendChild(div);

const ul = document.createElement("ul");

const entries = ["item 1", "item 2", "item 3", "item 4"];

entries.forEach(function(entry) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(entry));
  ul.appendChild(li);
});

element.appendChild(ul);

document.querySelector("body").appendChild(element);
```

you can simply write that:

```js
import { wrap } from "dom-element-wrapper";

const entries = ["item 1", "item 2", "item 3", "item 4"];
const items = entries.map(entry => wrap("li").appendText(entry));

const element = wrap("div", { id: "element-id" })
  .appendWrappers(
    wrap("div").appendWrappers(
      wrap("p").appendText("Lorem ipsum")
    ),
    wrap("ul").appendWrappers(
      ...items
    )
  )
  .unwrap();

document.querySelector("body").appendChild(element);
```

Both will create the following HTML tree structure but the latter is much shorter.

```html
<div id="element-id">
  <div>
    <p>Lorem ipsum</p>
  </div>
  <ul>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
    <li>item 4</li>
  </ul>
</div>
```

**So what is this `unwrap` method all about?**

When we wrap the DOM element when calling `wrap`, the element is being wrapped within a `proxy` object but if we try to append this proxy to a DOM element, it will fail so we need to revoke the proxy to release the underlying object, that is what `unwrap` does.

It is worth noting that you only need to call `unwrap` when you need to pass the element to a method that expects a actual DOM element. If you only need to manipulate an element, unwrapping is not necessary.

## API

#### Add a single node

```js
const element = wrap("div").appendNode("div", {
  id: "id",
  className: "class"
});
```

```html
<div class="container">
  <div id="id" class="class"></div>
</div>
```

#### Add a text

```js
const element = wrap("div").appendText("Hello world"));
```

```html
<div>
  Hello world
</div>
```

#### Add one or multiple wrappers

```js
const element = wrap("div").appendWrappers(
  wrap("h1"),
  wrap("h2"),
  wrap("p")
);
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
