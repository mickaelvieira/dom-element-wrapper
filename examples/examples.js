"use strict";

const wrap = DOMElementWrapper.wrap;

function form_example() {
  const form = wrap("form", {
    id: "my-form",
    action: "https://example.local",
    method: "POST",
    className: "form"
  })
    .addEventListener("submit", function(event) {
      event.preventDefault();
    })
    .appendWrappers(
      wrap("div", { className: "form-group" }).appendNode("input", {
        type: "text",
        id: "username",
        name: "username",
        className: "form-control"
      }),
      wrap("div", { className: "form-group" }).appendNode("input", {
        type: "text",
        id: "password",
        name: "password",
        className: "form-control"
      }),
      wrap("div", { className: "form-group" }).appendNode("input", {
        type: "submit",
        id: "username",
        name: "username",
        className: "btn btn-secondary",
        value: "Click me"
      })
    )
    .unwrap();

  const container = document.querySelector(".form-example");
  container.appendChild(form);
}

function list_example() {
  const items = ["Cat", "Dog", "Wolf"].map((name, index) =>
    wrap("li", { "data-id": index }).appendText(name)
  );

  const element = wrap("div")
    .setAttribute("id", "element-id")
    .appendWrappers(
      wrap("div").appendWrappers(wrap("h2").appendText("Animals")),
      wrap("ul", {
        role: "menu",
        "aria-menu": true,
        class: "menu-items"
      }).appendWrappers(...items)
    )
    .unwrap();

  const container = document.querySelector(".list-example");
  container.appendChild(element);
}

window.addEventListener("DOMContentLoaded", function() {
  form_example();
  list_example();
});
