import { fileToClassNames } from "../../lib/less";

describe("fileToClassNames", () => {
  test("it converts a file path to an array of class names (default camel cased)", async () => {
    const result = await fileToClassNames(`${__dirname}/../complex.less`);

    expect(result).toEqual(["nestedAnother", "nestedClass", "someStyles"]);
  });

  describe("nameFormat", () => {
    test("it converts a file path to an array of class names with kebab as the name format", async () => {
      const result = await fileToClassNames(`${__dirname}/../complex.less`, {
        nameFormat: "kebab",
      });

      expect(result).toEqual(["nested-another", "nested-class", "some-styles"]);
    });

    test("it converts a file path to an array of class names with param as the name format", async () => {
      const result = await fileToClassNames(`${__dirname}/../complex.less`, {
        nameFormat: "param",
      });

      expect(result).toEqual(["nested-another", "nested-class", "some-styles"]);
    });

    test("it converts a file path to an array of class names where only classes with dashes in the names are altered", async () => {
      const result = await fileToClassNames(`${__dirname}/../dashes.less`, {
        nameFormat: "dashes",
      });

      expect(result).toEqual(["App", "appHeader", "Logo"]);
    });

    test("it converts a file path to an array of class names where only classes with snake in the names are altered", async () => {
      const result = await fileToClassNames(`${__dirname}/../complex.less`, {
        nameFormat: "snake",
      });

      expect(result).toEqual(["nested_another", "nested_class", "some_styles"]);
    });

    test("it does not change class names when nameFormat is set to none", async () => {
      const result = await fileToClassNames(`${__dirname}/../dashes.less`, {
        nameFormat: "none",
      });

      expect(result).toEqual(["App", "App-Header", "Logo"]);
    });
  });

  describe("aliases", () => {
    test("it converts a file that contains aliases", async () => {
      const result = await fileToClassNames(`${__dirname}/../aliases.less`, {
        aliases: {
          "~fancy-import": `${__dirname}/../complex.less`,
          "~another": `${__dirname}/../style.less`,
        },
      });

      expect(result).toEqual([
        "myCustomClass",
        "nestedAnother",
        "nestedClass",
        "someClass",
        "someStyles",
      ]);
    });
  });
});
