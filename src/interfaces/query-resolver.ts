import {
  AdaptorTypes,
  Constraint,
  DocRef,
  QueryRef,
} from '../adaptor/adaptor-types';
import { IQuery } from './query';

/**
 * Resolves a query based on a source document reference.
 * Allows a query to be extended with additional constraints.
 *
 * @typeParam A - The adaptor type, extending `AdaptorTypes`.
 * @typeParam S - The source document type.
 * @typeParam T - The target query result type.
 *
 * @example
 * ```typescript
 * const resolver: IQueryResolver = ... // Create a resolver
 * const extendedResolver = resolver.constraints(...constraints); // Extend
 * const data = await resolver(docRef).get() // Resolve
 * ```
 *
 * @group Resolvers
 * @internal
 */
export interface IQueryResolver<A extends AdaptorTypes, S, T> {
  /**
   * Resolves a query from the given document reference and returns a new
   * `IQuery`. However, the preferred method to do this is by invoking the
   * IQueryResolver directly.
   *
   * @param source - The document reference (`DocRef<A, S>`) to resolve the query from.
   * @returns A new `IQuery<A, T>` instance constructed with the resolved reference and adaptor.
   *
   * @example
   * ```typescript
   * const data = await resolver(docRef).get() // Called directly (preferred)
   * const data = await resolver.call(docRef).get() // Called as a function
   * ```
   */
  resolve(source: DocRef<A, S>): IQuery<A, T>;
  (docRef: DocRef<A, S>): IQuery<A, T>;
  // call(source: DocRef<A, S>): IQuery<A, T>;

  /**
   * Applies one or more query constraints to the current query resolver and
   * returns a new `IQueryResolver`. How constraints are defined and applied
   * is determined by the adaptor.
   *
   * @param constraints - One or more `Constraint<A>` objects to apply to the query.
   * @returns A new `IQueryResolver<A, S, T>` with the specified constraints applied.
   *
   * @example
   * ```typescript
   * const filteredResolver = resolver.constraints(where('field', '==', value), orderBy('field'));
   * const results = await filteredResolver(docRef).get();
   * ```
   */
  constraints(...constraints: Constraint<A>[]): IQueryResolver<A, S, T>;

  /**
   * Applies a query transformation to the current query. How the query is
   * extended depends on the underlying adaptor.
   *
   * @param getQuery - A function that receives the current collection or query
   * reference and returns a new query reference with additional query constraints.
   * @returns A new `IQueryResolver` configured with the transformed query.
   *
   * @example
   * ```typescript
   * const filteredResolver = resolver.query(
   *  (q) => q.where('amount', '>', '3.50') // Extend the query
   * );
   * ```
   */
  query(
    getQuery: (query: QueryRef<A, T>) => QueryRef<A, T>
  ): IQueryResolver<A, S, T>;
}
