# ES6 Modules Refactor

Your code has been refactored into ES6 modules:

- `icons.js` – Icon definitions
- `storage.js` – LocalStorage and data fetching
- `sidebar.js` – Sidebar UI and interactions
- `snippets.js` – Snippet CRUD and sorting
- `ui.js` – General UI helpers
- `main.js` – Entry point

To use, update your HTML:
```html
<script type="module" src="main.js"></script>
```

You may need to move some remaining logic (like event listeners, recents, tooltips, etc.) into the appropriate modules as you continue refactoring.
