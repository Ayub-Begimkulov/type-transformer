export type ComputeDeep<T> = T extends (...args: infer Args) => infer Return
  ? (...args: ComputeDeep<Args>) => ComputeDeep<Return>
  : T extends object
  ? {
      [K in keyof T]: ComputeDeep<T[K]>;
    } & unknown
  : T;
