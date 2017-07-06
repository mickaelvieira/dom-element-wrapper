# Element Wrapper

[![Build Status](https://travis-ci.org/mickaelvieira/dom-element-wrapper.svg?branch=master)](https://travis-ci.org/mickaelvieira/dom-element-wrapper)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://github.com/mickaelvieira/dom-element-wrapper/blob/master/LICENSE.md)

## Motivation

This module aims to provide a friendlier interface when it comes to creating
nodes using the DOM API.
If like me, you enjoy chaining stuff and you feel sad when you have to use the DOM API, this library is made for you.

## Limitation

The library relies on the [Proxy](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object which is not
yet supported by [all browsers](http://kangax.github.io/compat-table/es6/#Proxy) and cannot be [transpiled or polyfilled](https://babeljs.io/learn-es2015/#ecmascript-2015-features-proxies).

## Install

```
$ npm i --save dom-element-wrapper
```

or

```
$ yarn add dom-element-wrapper
```

## Usage

Instead of the writing this:

```
const element = document.createElement("div");
element.id = "element-id";

const div = document.createElement("div");
const p = document.createElement("p");

p.appendChild(document.createTextNode("Lorem ipsum"));
div.appendChild(p);

element.appendChild(div);

const ul = document.createElement("ul");

const li1 = document.createElement("li");
li1.appendChild(document.createTextNode("item 1"));
ul.appendChild(li1);

const li2 = document.createElement("li");
li2.appendChild(document.createTextNode("item 2"));
ul.appendChild(li2);

const li3 = document.createElement("li");
li3.appendChild(document.createTextNode("item 3"));
ul.appendChild(li3);

const li4 = document.createElement("li");
li4.appendChild(document.createTextNode("item 4"));
ul.appendChild(li4);

const li5 = document.createElement("li");
li5.appendChild(document.createTextNode("item 5"));
ul.appendChild(li5);

element.appendChild(ul);

document.querySelector("body").appendChild(element);
```

Simply write that:
```
import { createWrapper } from "dom-element-wrapper";

const element = createWrapper("div")
  .setAttribute("id", "element-id")
  .appendWrappers(
    createWrapper("div").appendWrappers(
      createWrapper("p").appendTextNode("Lorem ipsum")
    ),
    createWrapper("ul").appendWrappers(
      createWrapper("li").appendTextNode("item 1"),
      createWrapper("li").appendTextNode("item 2"),
      createWrapper("li").appendTextNode("item 3"),
      createWrapper("li").appendTextNode("item 4"),
      createWrapper("li").appendTextNode("item 5")
    )
  )
  .unwrap();

document.querySelector("body").appendChild(element);
```

It will create the following HTML structure:
```
<div id="element-id">
  <div>
    <p>Lorem ipsum</p>
  </div>
  <ul>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
    <li>item 4</li>
    <li>item 5</li>
  </ul>
</div>
```

## Contributing

Install the dependencies

```
$ yarn run build
```

Run the test suite

```
$ yarn test
```

Run the linter

```
$ yarn run lint
```
