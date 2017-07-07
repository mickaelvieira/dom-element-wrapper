import createWrapper from "../src/createWrapper";

describe("createWrapper", () => {
  test("can create a node and wrap it", () => {
    const wrapper = createWrapper("div");

    expect(wrapper.nodeType).toBe(Node.ELEMENT_NODE);
    expect(wrapper.nodeName.toLowerCase()).toBe("div");
  });

  test("can wrap an existing node", () => {
    const wrapper = createWrapper(document.createElement("div"));

    expect(wrapper.nodeType).toBe(Node.ELEMENT_NODE);
    expect(wrapper.nodeName.toLowerCase()).toBe("div");
  });

  test("revokes the proxy and returns the underlying node", () => {
    const wrapper = createWrapper("div");
    expect(wrapper.nodeType).toBe(Node.ELEMENT_NODE);

    const node = wrapper.unwrap();

    expect(node.nodeType).toBe(Node.ELEMENT_NODE);

    expect(() => {
      const type = wrapper.nodeType;
    }).toThrow();
  });

  test("knows its prototypes", () => {
    const wrapper = createWrapper("div");
    expect(wrapper instanceof EventTarget).toBe(true);
    expect(wrapper instanceof Node).toBe(true);
    expect(wrapper instanceof Element).toBe(true);

    const node = wrapper.unwrap();
    expect(node instanceof EventTarget).toBe(true);
    expect(node instanceof Node).toBe(true);
    expect(node instanceof Element).toBe(true);
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

  test("should return of methods starting with get, has, is", () => {
    const element = createWrapper("div", {
      className: "my-class-name",
      id: "my-element"
    });
    expect(element.getAttribute("id")).toBe("my-element");
    expect(element.hasAttribute("class")).toBe(true);
    expect(element.isEqualNode(element)).toBe(true);
  });

  test("should be able to clone a node", () => {
    const wrapper = createWrapper("div");
    const node2 = wrapper.cloneNode(true);
    const node1 = wrapper.unwrap();

    expect(node1.nodeType).toBe(Node.ELEMENT_NODE);
    expect(node2.nodeType).toBe(Node.ELEMENT_NODE);
    expect(node1 === node2).toBe(false);
  });

  test("should not intercept whitelisted methods", () => {
    const wrapper = createWrapper("div").appendNode("p", {
      className: "my-class"
    });

    expect(
      wrapper.compareDocumentPosition(document.createElement("p"))
    ).toEqual(expect.any(Number));

    expect(wrapper.contains(document.createElement("p"))).toEqual(
      expect.any(Boolean)
    );

    // expect(wrapper.lookupNamespaceURI()).toEqual(expect.any(String));
    // expect(wrapper.lookupPrefix()).toEqual(expect.any(String));

    expect(wrapper.matches("div")).toEqual(expect.any(Boolean));
    expect(wrapper.querySelector(".my-class")).toEqual(expect.any(Node));
    expect(wrapper.querySelectorAll(".my-class")).toEqual(expect.any(NodeList));
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

  test("restores the node as it was before wrapping", () => {
    const wrapper = createWrapper("div");
    const node = wrapper.unwrap();

    expect(node.unwrap).toBeUndefined();
    expect(node.appendNode).toBeUndefined();
    expect(node.appendTextNode).toBeUndefined();
    expect(node.appendWrappers).toBeUndefined();
    expect(node.appendChildren).toBeUndefined();
  });
});
