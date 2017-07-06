# Element Wrapper

[![Build Status](https://travis-ci.org/mickaelvieira/element-wrapper.svg?branch=master)](https://travis-ci.org/mickaelvieira/element-wrapper)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://github.com/mickaelvieira/element-wrapper/blob/master/LICENSE.md)

## Motivation

This module aims to provide a more friendly interface when it comes to creating
nodes using the DOM API.
If like me, you like chaining stuff and you feel sad when you have to use the OM API, this library is made for you.

## Install

```
$ npm i --save redux-logger
```

or

```
$ yarn add element-wrapper
```

## Usage

```
import { createWrapper } from "element-wrapper";

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

```
$ yarn run build
$ yarn run test
```
