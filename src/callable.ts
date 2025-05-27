export type CallableFn<A, R> = (arg: A) => R;

export type ICallable<A, R> = {
  call: CallableFn<A, R>;
};

export type Callable<T extends ICallable<A, R>, A, R> = T & CallableFn<A, R>;

export function MakeCallable<T extends ICallable<A, R>, A, R>(
  obj: T
): Callable<T, A, R> {
  const fn = obj.call.bind(obj);
  const result = Object.assign(fn, obj);

  // Preserve the constructor's class methods
  Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).map((name) => {
    (result as any)[name] = (obj as any)[name];
  });

  // Set the prototype to the original object's prototype
  Object.setPrototypeOf(result, Object.getPrototypeOf(obj));

  return result;
}

// export interface IResolver<Source, Target> {
//   (source: Source): Target;
//   resolve(source: Source): Target;
// }

// export interface IResolverWith<Source, Arg, Target> {
//   (source: Source, arg: Arg): Target;
//   resolve(source: Source, arg: Arg): Target;
// }
