import { AdaptorTypes, DocRef } from '../adaptor/adaptor-types';
import { IQuery } from './query';

/**
 * An interface that defines a query resolver that can resolve a query
 * from a document reference and an additional argument.
 *
 * @typeParam A - The adaptor type, extending `AdaptorTypes`.
 * @typeParam S - The source document type.
 * @typeParam T - The target query result type.
 * @typeParam Arg - The type of the additional argument that may be used to modify the query.
 *
 * @example
 * ```typescript
 * const resolver: IQueryWithResolver = ... // Create a resolver
 * const data = await resolver(docRef, 5).get() // Resolve
 * ```
 *
 * @group Resolvers
 * @internal
 */
export interface IQueryWithResolver<A extends AdaptorTypes, S, T, Arg> {
  /**
   * Resolves a query from the given document reference accompanied by an
   * additional argument and returns a new `IQuery`. However, the preferred
   * method to do this is by invoking the IQueryWithResolver directly.
   *
   * @param source - The document reference (`DocRef<A, S>`) to resolve the query from.
   * @param arg - An additional argument that may be used to modify the query.
   * @returns A new `IQuery<A, T>` instance constructed with the resolved reference and adaptor.
   *
   * @example
   * ```typescript
   * const data = await resolver(docRef, 5).get() // Called directly (preferred)
   * const data = await resolver.resolve(docRef, 5).get() // Called as a function
   * ```
   */
  resolve(source: DocRef<A, S>, arg: Arg): IQuery<A, T>;
  (docRef: DocRef<A, S>, arg: Arg): IQuery<A, T>;
}
