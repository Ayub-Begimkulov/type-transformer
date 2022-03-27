import { castToType, types } from '../cast-to-type';

// TODO add more type tests?

type Equals<A, B> = (<T>() => T extends A ? 1 : 0) extends <T>() => T extends B
  ? 1
  : 0
  ? true
  : false;

declare function asserts<T extends boolean>(val: T): void;

let a = castToType(
  5,
  types.object({
    a: types.number,
    b: types.string,
    c: types.object({
      d: types.boolean,
    }),
  })
);

asserts<Equals<typeof a, { a: number; b: string; c: { d: boolean } }>>(true);

let b = castToType(5, types.object({}));

asserts<Equals<typeof b, {}>>(true);
