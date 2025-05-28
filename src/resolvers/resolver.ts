export type PropertiesOf<T> = { [P in keyof T]: T[P] };

export type ResolveFn<Arg1, ReturnValue> = (arg1: Arg1) => ReturnValue;

export function MakeResolver<T, Arg1, ReturnValue>(
  obj: T,
  resolveFn: ResolveFn<Arg1, ReturnValue>
): T & ResolveFn<Arg1, ReturnValue> {
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

export type ResolveWithFn<Arg1, Arg2, ReturnValue> = (
  arg1: Arg1,
  arg2: Arg2
) => ReturnValue;

export function MakeResolverWith<T, Arg1, Arg2, ReturnValue>(
  obj: T,
  resolveFn: ResolveWithFn<Arg1, Arg2, ReturnValue>
): T & ResolveWithFn<Arg1, Arg2, ReturnValue> {
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
