import { test, expect } from "@jest/globals";
import { HTMLForJavaScript } from ".";
import { html } from "@leafac/html";

test("HTMLForJavaScript()", () => {
  const exampleHTMLForJavaScript = HTMLForJavaScript();
  expect(
    exampleHTMLForJavaScript(html`<p>Example</p>`)
  ).toMatchInlineSnapshot();
  expect(html`$${exampleHTMLForJavaScript}`).toMatchInlineSnapshot();
});
