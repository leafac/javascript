# ⚠️ WORK-IN-PROGRESS. What follows are notes that will at some point turn into proper documentation. ⚠️

# My Version of morphdom

## Essential Features

- **Type.**
  - A way to distinguish between components that rely on the same tag.
  - For example, `<div data-type="conversations">` and `<div data-type="new-conversation">`.
  - Prevents trying to morph between completely unrelated components, which is just a lot of unnecessary work compared to a complete replacement.
  - May repeat between siblings.
  - Similar to React’s named components (`<TagsWhichStartWithACapitalLetter>`), and to nanomorph’s `data-nanomorph-component-id`.
  - **COULD THIS BE SUBSUMED BY KEYS?**
  - **WOULD IT BE MORE IDIOMATIC TO USE CUSTOM TAGS (for example, `<x-conversations></x-conversations>`)?**
    - Pros:
      - Cleaner.
    - Cons:
      - May require a bit more of explicit styling, because by default custom tags are inline elements but most components behave like block elements.
      - Are less familiar to some people.
- **Key.**
  - A way to deal with insertions, deletions, and transposition of siblings that are list-like.
  - Must be unique among siblings, but may repeat across the document.
  - Only works when all siblings are elements, and they’re all keyed.
  - Similar to React’s `key`s.
- **Longest Common Subsequence (LCS).**
  - Minimize modifications to the DOM, which helps preserve state such as scrolling position, input caret positions, CSS transitions, and so forth.
  - May alleviate some of the manual work of assigning types & keys.
  - Performance-wise, minimizing modifications to the DOM makes things faster but computing the LCS makes things slower, and whether the trade-off is worth it is up in the air.
  - This is what React seems to do. Contrary to [their documentation](https://reactjs.org/docs/reconciliation.html#recursing-on-children), even without keys React recognizes an insertion in the middle of a list without `key`s.

## Desirable Features

- Separate `diff` & `patch`, so that the `diff` may be done on the server, and the `patch` on the client.
  - This is more work for the server, but minimizes data on the wire and load on the client, which may be advantageous, particularly for people on mobile connections, in which case it’s reasonable to expect the internet to be slower and the device to be less powerful.

## Ideas

- Start with simple list traversal, like morphdom seems to do, and React’s documentation claims to do (but apparently doesn’t).
  - Use some heuristics to catch insertions/deletions in the middle?
- Use LCS.
- Use `.isEqualNode()`.
- Code to morph attributes when there’s a match between elements and we’re about to dig in:

  ```javascript
  morph(from, to) {
    const attributeMorphFrom = from.querySelector("div:nth-child(1)");
    const attributeMorphTo = to.querySelector("div:nth-child(1)");
    for (const attribute of attributeMorphFrom.getAttributeNames()) {
      const toAttribute = attributeMorphTo.getAttribute(attribute);
      if (toAttribute === null) attributeMorphFrom.removeAttribute(attribute);
      else if (toAttribute !== attributeMorphFrom.getAttribute(attribute))
        attributeMorphFrom.setAttribute(attribute, toAttribute);
    }
    for (const attribute of attributeMorphTo.getAttributeNames())
      if (attributeMorphFrom.getAttribute(attribute) === null)
        attributeMorphFrom.setAttribute(
          attribute,
          attributeMorphTo.getAttribute(attribute)
        );
  },
  ```

## Related Work

- **Similar Libraries.**
  - <https://npm.im/morphdom>
    - Transposition is only handled via `id`s, which are global, not scoped to siblings.
    - [Doesn’t handle well the case of insertions in the middle, losing state (for example, scrolling position) of siblings](https://github.com/patrick-steele-idem/morphdom/issues/200).
  - <https://npm.im/nanomorph>
    - Transposition is only handled via `id`s, which are global, not scoped to siblings.
    - No lifecycle callbacks (though most of them are subsumed by other mechanisms, for example, `.isSameNode()`).
    - Transferring callback handlers seems heavy-handed (though it may be a good idea in practice).
  - Others
    - Rely on some notion of virtual DOM or introduce abstractions and opinions in terms of how components should be specified.
- **Algorithms.**
  - [React Reconciliation](https://reactjs.org/docs/reconciliation.html)
    - Claims to be linear time (`O(n)`), but it’s getting right some insertions in the middle of a list, which I don’t think one can do in linear time 🤷
  - Tree edit distance:
    - This would be the optimal solution because it finds subtree movements across the tree, not limited to reordering siblings at a given level. Unfortunately, it’s too costly to be practical, so it makes sense to follow React’s heuristic of handling that edge case by destructing and reconstructing the subtree. Effectively, this turns the tree edit distance into a bunch of LCS problems, which are more tractable.
    - https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf
    - http://tree-edit-distance.dbresearch.uni-salzburg.at/
    - https://stackoverflow.com/questions/1065247/how-do-i-calculate-tree-edit-distance
    - https://dl.acm.org/doi/10.1145/2699485
