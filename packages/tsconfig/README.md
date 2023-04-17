# tsconfig

These are base shared `tsconfig.json`s from which all other `tsconfig.json`'s inherit from.

## Notes

### `react-library.json`
#### react-jsx
The legacy `react` option instead of `react-jsx` is being used
for the `compilerOptions.jsx` field.     

_Reason:_
reef-knot supports react v17 at the moment of writing.
It has an issue with ESM because it has no `exports`
field in the `package.json`. It is fixed in react v18, and we
can switch to `react-jsx` option after migrating to react v18.  
More info: https://github.com/facebook/react/issues/20235
