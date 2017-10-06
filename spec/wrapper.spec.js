import wrap from "../src/wrapper";

describe("wrap", () => {
  test("can create a node and wrap it", () => {
    const wrapper = wrap("div");

    expect(wrapper.nodeType).toBe(Node.ELEMENT_NODE);
    expect(wrapper.nodeName.toLowerCase()).toBe("div");
  });

  test("can wrap an existing node", () => {
    const wrapper = wrap(document.createElement("div"));

    expect(wrapper.nodeType).toBe(Node.ELEMENT_NODE);
    expect(wrapper.nodeName.toLowerCase()).toBe("div");
  });

  test("revokes the proxy and returns the underlying node", () => {
    const wrapper = wrap("div");
    expect(wrapper.nodeType).toBe(Node.ELEMENT_NODE);

    const node = wrapper.unwrap();

    expect(node.nodeType).toBe(Node.ELEMENT_NODE);

    expect(() => {
      const type = wrapper.nodeType;
    }).toThrow();
  });

  test("knows its prototypes", () => {
    const wrapper = wrap("div");
    expect(wrapper instanceof EventTarget).toBe(true);
    expect(wrapper instanceof Node).toBe(true);
    expect(wrapper instanceof Element).toBe(true);

    const node = wrapper.unwrap();
    expect(node instanceof EventTarget).toBe(true);
    expect(node instanceof Node).toBe(true);
    expect(node instanceof Element).toBe(true);
  });

  test("returns the node type", () => {
    expect(wrap("div").nodeType).toBe(Node.ELEMENT_NODE);
  });

  test("returns the list of child nodes", () => {
    expect(wrap("div").childNodes instanceof NodeList).toBe(true);
  });

  test("returns the list of class names", () => {
    expect(wrap("div").classList instanceof DOMTokenList).toBe(true);
  });

  test("is chainable", () => {
    const element = wrap("div");
    element
      .setAttribute("id", "my-id")
      .appendChild(document.createElement("p"))
      .appendChild(document.createElement("p"))
      .inject("div", "div")
      .appendWrappers(
        wrap("ul").appendWrappers(
          wrap("li").appendText("item 1"),
          wrap("li").appendText("item 2")
        )
      );

    expect(element.hasAttribute("id")).toBe(true);
    expect(element.getAttribute("id")).toBe("my-id");
    expect(element.childNodes.length).toBe(5);
    expect(element.lastChild.childNodes.length).toBe(2);
  });

  test("throws an error when the property or method does not exist", () => {
    const element = wrap("div");
    expect(() => {
      element.whatever_function();
    }).toThrowError('Invalid method or property name "whatever_function"');

    expect(() => {
      const value = element.whatever_property;
    }).toThrowError('Invalid method or property name "whatever_property"');
  });

  test("may be build with a set of properties", () => {
    const element = wrap("div", {
      className: "my-class-name",
      id: "my-element"
    });

    expect(element.id).toBe("my-element");
    expect(element.className).toBe("my-class-name");

    expect(element.hasAttribute("id")).toBe(true);
    expect(element.hasAttribute("class")).toBe(true);
  });

  test("should return of methods starting with get, has, is", () => {
    const element = wrap("div", {
      className: "my-class-name",
      id: "my-element"
    });
    expect(element.getAttribute("id")).toBe("my-element");
    expect(element.hasAttribute("class")).toBe(true);
    expect(element.isEqualNode(element)).toBe(true);
  });

  test("should be able to clone a node", () => {
    const wrapper = wrap("div");
    const node2 = wrapper.cloneNode(true);
    const node1 = wrapper.unwrap();

    expect(node1.nodeType).toBe(Node.ELEMENT_NODE);
    expect(node2.nodeType).toBe(Node.ELEMENT_NODE);
    expect(node1 === node2).toBe(false);
  });

  test("should not intercept whitelisted methods", () => {
    const wrapper = wrap("div").appendNode("p", {
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
    const element = wrap("div").appendText("hello world");
    expect(element.firstChild.nodeType).toBe(Node.TEXT_NODE);
    expect(element.innerHTML).toBe("hello world");
  });

  test("appends a node", () => {
    const element = wrap("div").appendNode("p");
    expect(element.firstChild.nodeType).toBe(Node.ELEMENT_NODE);
    expect(element.firstChild.nodeName.toLowerCase()).toBe("p");
  });

  test("appends a node with properties", () => {
    const element = wrap("div").appendNode("p", {
      className: "my-css-class"
    });
    expect(element.firstChild.nodeType).toBe(Node.ELEMENT_NODE);
    expect(element.firstChild.nodeName.toLowerCase()).toBe("p");
    expect(element.firstChild.className).toBe("my-css-class");
  });

  test("appends a proxy element", () => {
    const element1 = wrap("div");
    const element2 = wrap("p");

    element1.appendWrappers(element2);

    expect(element1.firstChild.nodeType).toBe(Node.ELEMENT_NODE);
    expect(element1.firstChild.nodeName.toLowerCase()).toBe("p");
  });

  test("appends multiple proxy elements", () => {
    const element1 = wrap("div");
    const element2 = wrap("p");
    const element3 = wrap("span");

    element1.appendWrappers(element2, element3);

    expect(element1.firstChild.nodeName.toLowerCase()).toBe("p");
    expect(element1.lastChild.nodeName.toLowerCase()).toBe("span");
  });

  test("appends multiple child nodes", () => {
    const element = wrap("div");

    const children = [
      document.createElement("p"),
      "here my cool text",
      "br",
      ["h1"],
      ["span", { id: "element-id" }]
    ];

    element.inject(...children);

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
    const element = document.createElement("div");
    element.custom1 = "hello";

    const wrapper = wrap(element);
    wrapper.custom2 = function() {};

    const node = wrapper.unwrap();

    expect(node.unwrap).toBeUndefined();
    expect(node.node).toBeUndefined();
    expect(node.text).toBeUndefined();
    expect(node.wrappers).toBeUndefined();
    expect(node.inject).toBeUndefined();
    expect(
      (function() {
        return node.custom1;
      })()
    ).toEqual(expect.any(String));
    expect(node.custom2).toEqual(expect.any(Function));
  });

  test("does not enumerate its own properties", () => {
    const node = document.createElement("div");
    node.custom1 = function() {};

    const wrapper = wrap(node);
    node.custom2 = function() {};

    wrapper.custom3 = "value";

    expect(Object.keys(wrapper)).toEqual(["custom1", "custom2", "custom3"]);
  });
});
