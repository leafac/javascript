import { test, expect } from "@jest/globals";
import { HTMLForJavaScript } from ".";
import { html } from "@leafac/html";

test("HTMLForJavaScript()", () => {
  let fakeRandomNumber = 0.1;
  Math.random = () => {
    fakeRandomNumber = (fakeRandomNumber + 0.7) % 1;
    return fakeRandomNumber;
  };
  const exampleHTMLForJavaScript = HTMLForJavaScript();
  expect(exampleHTMLForJavaScript(html`<p>Example</p>`)).toMatchInlineSnapshot(
    `"document.querySelector(\\".html-for-javascript--ssssssssssi\\")"`
  );
  expect(exampleHTMLForJavaScript(html`<p>Example</p>`)).toMatchInlineSnapshot(
    `"document.querySelector(\\".html-for-javascript--i\\")"`
  );
  expect(html`$${exampleHTMLForJavaScript}`).toMatchInlineSnapshot(
    `"<div hidden class=\\"html-for-javascript\\"><div class=\\"html-for-javascript--ssssssssssi\\"><p>Example</p></div><div class=\\"html-for-javascript--i\\"><p>Example</p></div></div>"`
  );
});
