import {
  AdaptorTypes,
  Constraint,
  DocRef,
  QueryRef,
} from '../adaptor/adaptor-types';
import { ICol } from './col';
import { IQueryWithResolver } from './query-with-resolver';

/**
 * Resolves a collection reference based on a source document reference.
 * Allows a collection to be extended with additional query constraints.
 *
 * @typeParam A - The adaptor type, extending `AdaptorTypes`.
 * @typeParam S - The source document type.
 * @typeParam T - The target collection document type.
 *
 * @example
 * ```typescript
 * const resolver: IColResolver = ... // Create a resolver
 * const col = resolver(docRef); // Resolve from a document reference
 * const filteredResolver = resolver.constraints(...constraints);  // Extend
 * ```
 *
 * @group Resolvers
 * @internal
 */
export interface IColResolver<A extends AdaptorTypes, S, T> {
  /**
   * Resolves a collection reference from the given document reference and
   * returns a new `ICol`. However, the preferred method to do this is
   * by invoking the IColResolver directly.
   *
   * @param source - The document reference from which to resolve the collection.
   * @returns A new `ICol` instance associated with the resolved collection reference.
   *
   * @example
   * ```typescript
   * const data = await resolver(docRef).get() // Called directly (preferred)
   * const data = await resolver.resolve(docRef).get()
   * ```
   */
  resolve(source: DocRef<A, S>): ICol<A, T>;
  (source: DocRef<A, S>): ICol<A, T>;

  /**
   * Applies a query transformation to the current collection or query reference.
   * How the query is extended depends on the underlying adaptor.
   *
   * @param getQuery - A function that receives the current collection and
   * returns a new query reference with additional query constraints.
   * @returns A new `IColResolver` instance configured with the transformed query.
   *
   * @example
   * ```typescript
   * const filteredResolver = resolver.query(
   *  (q) => q.where('amount', '>', '3.50') // extend the query
   * );
   * ```
   */
  query(
    getQuery: (query: QueryRef<A, T>) => QueryRef<A, T>
  ): IColResolver<A, S, T>;

  /**
   * Applies one or more query constraints to the collection resolver and
   * returns a new `IColResolver` with the updated query logic.
   * How constraints are defined and applied is determined by the adaptor.
   *
   * @param constraints - One or more `Constraint<A>` objects to apply to the query.
   * @returns A new `IColResolver<A, S, T>` instance with the specified constraints applied.
   *
   * @example
   * ```typescript
   * const filteredResolver = resolver.constraints(
   *   where('amount', '>', '3.50'), // apply constraints
   *   orderBy('amount', 'desc') // apply additional constraints
   * );
   */
  constraints(...constraints: Constraint<A>[]): IColResolver<A, S, T>;

  /**
   * Creates a new `IQueryWithResolver` that allows
   * resolving a query with additional arguments.
   *
   * @param getQuery - A function that receives the current query reference
   * and an argument, returning a new query reference.
   * @returns A new `IQueryWithResolver` instance configured with the transformed query.
   * @example
   * ```typescript
   * const extendedResolver = resolver.queryWith(
   *   (q, arg) => q.where('amount', '>', arg) // Extend the query with an argument
   * );
   * ```
   */
  queryWith<Arg>(
    getQuery: (q: QueryRef<A, T>, arg: Arg) => QueryRef<A, T>
  ): IQueryWithResolver<A, S, T, Arg>;

  /**
   * Creates a new `IQueryWithResolver` that allows
   * resolving a query with additional constraints based on an argument.
   *
   * @param getConstraints - A function that receives an argument and returns an array of constraints.
   * @returns A new `IQueryWithResolver` instance configured with the transformed query.
   * @example
   * ```typescript
   * const extendedResolver = resolver.constraintsWith(
   *   (arg) => [where('amount', '>', arg)] // Apply constraints based on an argument
   * );
   * ```
   */
  constraintsWith<Arg>(
    getConstraints: (arg: Arg) => Constraint<A>[]
  ): IQueryWithResolver<A, S, T, Arg>;
}
