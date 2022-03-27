# Type Transformer

A simple utility to help you transform your values to a correct type.

## The problem

Very often in real world applications we use data from a sources that might not guaranty us a correct data type (for instance, query params, local storage, third party API's).

So to build a solid application that can steel function when provided with a wrong data, we must always verify the shape of the external data.

However, it makes our code messy and harder to read. Also you might repeat the same/similar logic across your app.

This is why I decided to create a type transformer.

## Usage

```ts
import { castToType, types } from 'type-transform';

// create a correct model type, from simple primitive values
// to complex objects

const valueType = types.object({
  a: types.number,
  b: {
    c: types.boolean,
  },
});

const value = castToType({ b: { c: false } }, valueType);
console.log(value);
// {
//   a: -1, // library casted `number` type to `-1`
//   b: {
//     c: false
//   }
// }
```

If you use TypeScript, casted value will have a correct type according to the value model.

## License

MIT.
