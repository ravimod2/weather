# Weather CLI — Claude Guidelines

## Rules

1. **JSDoc on every function** — include `@param` and `@returns` tags on all functions.

2. **Functional programming patterns** — prefer pure functions, avoid mutation, use `map`/`filter`/`reduce` over imperative loops.

3. **Graceful API error handling** — always catch axios errors, distinguish between network failures and API-level errors (4xx/5xx), and surface a human-readable message to the user.

4. **Test coverage** — every new function must have a corresponding unit test in `tests/`. Run `npm test` before committing.
