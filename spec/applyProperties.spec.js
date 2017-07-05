import applyProperties from "../src/applyProperties";

describe("applyProperties", () => {
  test("applies proerpties to the node", () => {
    const element = document.createElement("div");
    const props = {
      id: "my-id",
      className: "my-class",
      whaterer: "whaterer-value"
    };

    applyProperties(element, props);

    expect(element.className).toBe("my-class");
    expect(element.id).toBe("my-id");
    expect(element.whaterer).toBe("whaterer-value");
  });
});
