import { BOOLEAN, STRING, NUMBER, NULL, UNDEFINED, OBJECT } from './constants';
import { ComputeDeep } from './types';
import {
  isNumber,
  isBoolean,
  isString,
  isNull,
  isUndefined,
  isObject,
  exhaustiveCheck,
} from './utils';

type PrimitiveType =
  | {
      readonly type: typeof BOOLEAN;
    }
  | {
      readonly type: typeof STRING;
    }
  | {
      readonly type: typeof NUMBER;
    }
  | {
      readonly type: typeof NULL;
    }
  | {
      readonly type: typeof UNDEFINED;
    };

interface ObjectType {
  type: typeof OBJECT;
  properties: ObjectTypeProperties;
}

interface ObjectTypeProperties
  extends Record<string, ObjectType | PrimitiveType> {}

type ValueType = ObjectType | PrimitiveType;

export const types = {
  boolean: { type: BOOLEAN },
  string: { type: STRING },
  number: { type: NUMBER },
  null: { type: NULL },
  undefined: { type: UNDEFINED },
  object<T extends ObjectTypeProperties>(properties: T) {
    return { type: OBJECT, properties } as const;
  },
} as const;

type TokenToTypeMap = {
  [BOOLEAN]: boolean;
  [STRING]: string;
  [NUMBER]: number;
  [NULL]: null;
  [UNDEFINED]: undefined;
};

type CastedObjectType<ModelType extends ObjectType> = {
  [K in keyof ModelType['properties']]: CastedType<ModelType['properties'][K]>;
};

type CastedType<ModelType extends ValueType> = ModelType extends PrimitiveType
  ? TokenToTypeMap[ModelType['type']]
  : ModelType extends ObjectType
  ? CastedObjectType<ModelType>
  : never;

export function castToType<T extends ValueType>(
  value: unknown,
  model: T
): ComputeDeep<CastedType<T>> {
  return castToTypeInner(value, model) as any;
}

function castToTypeInner(value: unknown, model: ValueType) {
  switch (model.type) {
    case NUMBER: {
      if (isNumber(value)) {
        return value;
      }
      return -1;
    }
    case BOOLEAN: {
      if (isBoolean(value)) {
        return value;
      }
      return false;
    }
    case STRING: {
      if (isString(value)) {
        return value;
      }
      return '';
    }
    case NULL: {
      if (isNull(value)) {
        return value;
      }
      return null;
    }
    case UNDEFINED: {
      if (isUndefined(value)) {
        return value;
      }
      return undefined;
    }
    case OBJECT: {
      // TODO should we preserve additional properties that
      // are in the object? because typings don't reflect it
      // right now
      const result = isObject(value) ? value : {};

      // we make it recursive without tail call optimization
      // because it is not supported by any browsers apart from safari
      Object.entries(model.properties).forEach(([key, propertyModel]) => {
        // if user passed object and it doesn't have `key` property
        // it will either be casted to a needed type,
        // or will remain `undefined` if model has such type
        result[key] = castToType(result[key], propertyModel);
      });

      return result;
    }
    default:
      exhaustiveCheck(model);
  }
}
