export type PropertiesOf<T> = { [P in keyof T]: T[P] };

export type ResolverFn<A, R> = (arg: A) => R;

export function MakeResolver<T, A, R>(
  obj: T,
  resolveFn: ResolverFn<A, R>
): T & ResolverFn<A, R> {
  const fn = resolveFn.bind(obj);
  const result = Object.assign(fn, obj);

  // Preserve the constructor's class methods
  Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).map((name) => {
    (result as any)[name] = (obj as any)[name];
  });

  // Set the prototype to the original object's prototype
  Object.setPrototypeOf(result, Object.getPrototypeOf(obj));

  return result;
}
