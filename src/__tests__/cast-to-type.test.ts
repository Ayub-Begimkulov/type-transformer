import { castToType, types } from '../cast-to-type';

const primitiveValues = [false, '', 1, null, undefined];

describe('castToType', () => {
  // doesn't seem like an understandable test
  // TODO make it have no logic
  (
    [
      ['boolean', 'boolean'],
      ['string', 'string'],
      ['number', 'number'],
      ['null', 'object'],
      ['undefined', 'undefined'],
    ] as const
  ).forEach(([type, typeofResult]) => {
    it(`should cast to ${type}`, () => {
      primitiveValues.forEach(value => {
        const castedValue = castToType(value, types[type]);
        expect(typeof castedValue).toBe(typeofResult);
      });
    });
  });

  it('should cast to object', () => {
    const emptyObjectType = types.object({});

    primitiveValues.forEach(value => {
      expect(castToType(value, emptyObjectType)).toStrictEqual({});
    });

    expect(castToType({}, emptyObjectType)).toStrictEqual({});
  });

  it('should cast to object with properties', () => {
    const objectType = types.object({
      a: types.number,
      b: types.string,
    });
    primitiveValues.forEach(value => {
      expect(castToType(value, objectType)).toStrictEqual({
        a: -1,
        b: '',
      });
    });

    expect(castToType({}, objectType)).toStrictEqual({
      a: -1,
      b: '',
    });

    expect(castToType({ a: 5 }, objectType)).toStrictEqual({ a: 5, b: '' });
    expect(castToType({ b: 'asdf' }, objectType)).toStrictEqual({
      a: -1,
      b: 'asdf',
    });
    expect(castToType({ a: 4, b: 'asdf' }, objectType)).toStrictEqual({
      a: 4,
      b: 'asdf',
    });
  });

  it('should cast to object with nested properties', () => {
    const nestedObjectType = types.object({
      a: types.number,
      b: types.string,
      c: types.object({
        d: types.boolean,
      }),
    });
    primitiveValues.forEach(value => {
      expect(castToType(value, nestedObjectType)).toStrictEqual({
        a: -1,
        b: '',
        c: {
          d: false,
        },
      });
    });

    expect(castToType({}, nestedObjectType)).toStrictEqual({
      a: -1,
      b: '',
      c: {
        d: false,
      },
    });

    expect(castToType({ a: 5 }, nestedObjectType)).toStrictEqual({
      a: 5,
      b: '',
      c: {
        d: false,
      },
    });

    expect(castToType({ a: 4, b: 'asdf' }, nestedObjectType)).toStrictEqual({
      a: 4,
      b: 'asdf',
      c: {
        d: false,
      },
    });

    expect(
      castToType({ a: 4, b: 'asdf', c: 5 }, nestedObjectType)
    ).toStrictEqual({
      a: 4,
      b: 'asdf',
      c: {
        d: false,
      },
    });

    expect(
      castToType({ a: 4, b: 'asdf', c: { d: true } }, nestedObjectType)
    ).toStrictEqual({
      a: 4,
      b: 'asdf',
      c: {
        d: true,
      },
    });
  });

  // TODO should we do it or not?
  // because right now the typings doesn't reflect it
  it('should preserve original properties that are not in the type', () => {
    const objectType = types.object({
      a: types.number,
      b: types.string,
    });
    expect(castToType({ a: 4, d: 'hello world' }, objectType)).toStrictEqual({
      a: 4,
      b: '',
      d: 'hello world',
    });

    expect(
      castToType({ a: 4, b: 'how is it going?', d: 'hello world' }, objectType)
    ).toStrictEqual({
      a: 4,
      b: 'how is it going?',
      d: 'hello world',
    });
  });
});
