import createWrapper from "../src/createWrapper";

describe("createWrapper", () => {
  test("returns the underlying node", () => {
    const element = createWrapper("div").appendNode("p");
    expect(element.unwrap() instanceof Element).toBe(true);
  });

  test("returns the node type", () => {
    expect(createWrapper("div").nodeType).toBe(Node.ELEMENT_NODE);
  });

  test("returns the list of child nodes", () => {
    expect(createWrapper("div").childNodes instanceof NodeList).toBe(true);
  });

  test("returns the list of class names", () => {
    expect(createWrapper("div").classList instanceof DOMTokenList).toBe(true);
  });

  test("is chainable", () => {
    const element = createWrapper("div");
    element
      .setAttribute("id", "my-id")
      .appendChild(document.createElement("p"))
      .appendChild(document.createElement("p"))
      .appendChildren("div", "div")
      .appendWrappers(
        createWrapper("ul").appendWrappers(
          createWrapper("li").appendTextNode("item 1"),
          createWrapper("li").appendTextNode("item 2")
        )
      );

    expect(element.hasAttribute("id")).toBe(true);
    expect(element.getAttribute("id")).toBe("my-id");
    expect(element.childNodes.length).toBe(5);
    expect(element.lastChild.childNodes.length).toBe(2);
  });

  test("throws an error when the property or method does not exist", () => {
    const element = createWrapper("div");
    expect(() => {
      element.whatever_function();
    }).toThrowError('Invalid method or property name "whatever_function"');

    expect(() => {
      const value = element.whatever_property;
    }).toThrowError('Invalid method or property name "whatever_property"');
  });

  test("may be build with a set of properties", () => {
    const element = createWrapper("div", {
      className: "my-class-name",
      id: "my-element"
    });

    expect(element.id).toBe("my-element");
    expect(element.className).toBe("my-class-name");

    expect(element.hasAttribute("id")).toBe(true);
    expect(element.hasAttribute("class")).toBe(true);
  });

  test("may call method on the subject", () => {
    const element = createWrapper("div", {
      className: "my-class-name",
      id: "my-element"
    });
    expect(element.getAttribute("id")).toBe("my-element");
  });

  test("appends a text node", () => {
    const element = createWrapper("div").appendTextNode("hello world");
    expect(element.firstChild.nodeType).toBe(Node.TEXT_NODE);
    expect(element.innerHTML).toBe("hello world");
  });

  test("appends a node", () => {
    const element = createWrapper("div").appendNode("p");
    expect(element.firstChild.nodeType).toBe(Node.ELEMENT_NODE);
    expect(element.firstChild.nodeName.toLowerCase()).toBe("p");
  });

  test("appends a node with properties", () => {
    const element = createWrapper("div").appendNode("p", {
      className: "my-css-class"
    });
    expect(element.firstChild.nodeType).toBe(Node.ELEMENT_NODE);
    expect(element.firstChild.nodeName.toLowerCase()).toBe("p");
    expect(element.firstChild.className).toBe("my-css-class");
  });

  test("appends a proxy element", () => {
    const element1 = createWrapper("div");
    const element2 = createWrapper("p");

    element1.appendWrappers(element2);

    expect(element1.firstChild.nodeType).toBe(Node.ELEMENT_NODE);
    expect(element1.firstChild.nodeName.toLowerCase()).toBe("p");
  });

  test("appends multiple proxy elements", () => {
    const element1 = createWrapper("div");
    const element2 = createWrapper("p");
    const element3 = createWrapper("span");

    element1.appendWrappers(element2, element3);

    expect(element1.firstChild.nodeName.toLowerCase()).toBe("p");
    expect(element1.lastChild.nodeName.toLowerCase()).toBe("span");
  });

  test("appends multiple child nodes", () => {
    const element = createWrapper("div");

    const children = [
      document.createElement("p"),
      "here my cool text",
      "br",
      ["h1"],
      ["span", { id: "element-id" }]
    ];

    element.appendChildren(...children);

    expect(element.firstChild.nodeName.toLowerCase()).toBe("p");

    expect(element.childNodes[1].nodeType).toBe(Node.TEXT_NODE);
    expect(element.childNodes[1].nodeValue).toBe("here my cool text");

    expect(element.childNodes[2].nodeType).toBe(Node.ELEMENT_NODE);
    expect(element.childNodes[2].nodeName.toLowerCase()).toBe("br");

    expect(element.childNodes[3].nodeType).toBe(Node.ELEMENT_NODE);
    expect(element.childNodes[3].nodeName.toLowerCase()).toBe("h1");

    expect(element.lastChild.nodeName.toLowerCase()).toBe("span");
    expect(element.lastChild.id).toBe("element-id");
  });
});
