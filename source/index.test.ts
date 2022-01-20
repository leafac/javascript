import { test, expect } from "@jest/globals";
import { JavaScript, javascript, HTMLForJavaScript } from ".";

test("javascript``", () => {
  const clientSideJavaScript: JavaScript = javascript`console.log("Hello World")`;
  expect(clientSideJavaScript).toMatchInlineSnapshot(
    `"console.log(\\"Hello World\\")"`
  );
});

test("HTMLForJavaScript()", () => {
  const exampleHTMLForJavaScript = HTMLForJavaScript();
});
