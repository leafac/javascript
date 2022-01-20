import javascript from "tagged-template-noop";
export default javascript;
export type JavaScript = string;
import { HTML, html } from "@leafac/html";

export function HTMLForJavaScript(): {
  (html_: HTML): JavaScript;
  toString(): HTML;
} {
  const parts: HTML[] = [];
  const adder = (html_: HTML): JavaScript => {
    const className = `html-for-javascript--${Math.random()
      .toString(36)
      .slice(2)}`;
    parts.push(html`<div class="${className}">$${html_}</div>`);
    return javascript`document.querySelector(".${className}")`;
  };
  adder.toString = () => parts.join("");
  return adder;
}
