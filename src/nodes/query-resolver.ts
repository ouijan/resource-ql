import {
  AdaptorTypes,
  IAdaptor,
  Constraint,
  DocRef,
  QueryRef,
} from '../adaptor';
import { Query } from './query';

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
 * const resolver: QueryResolver = ... // Create a resolver
 * const extendedResolver = resolver.constraints(...constraints); // Extend
 * const data = await resolver(docRef).get() // Resolve
 * ```
 *
 * @category Resolvers
 * @hideconstructor @internal
 */
export class QueryResolver<A extends AdaptorTypes, S, T> {
  constructor(
    private _adaptor: IAdaptor<A>,
    public _resolveQuery: (source: DocRef<A, S>) => QueryRef<A, T>
  ) {}

  /**
   * Resolves a query from the given document reference and returns a new
   * `Query` instance. However, the preferred method to do this is by invoking
   * the QueryResolver directly.
   *
   * @see call
   *
   * @param source - The document reference (`DocRef<A, S>`) to resolve the query from.
   * @returns A new `Query<A, T>` instance constructed with the resolved reference and adaptor.
   *
   * @example
   * ```typescript
   * const data = await resolver(docRef).get() // Called directly (preferred)
   * const data = await resolver.call(docRef).get() // Called as a function
   * ```
   */
  resolve(source: DocRef<A, S>): Query<A, T> {
    const ref = this._resolveQuery(source);
    return new Query(this._adaptor, ref);
  }

  /**
   * Allows the QueryResolver to be invoked directly, which is the preferred
   * method to resolve a query. Uses the `resolve` method of the current instance.
   *
   * @see resolve
   *
   * @example
   * ```typescript
   * const data = await resolver(docRef).get()
   * ```
   */
  call = this.resolve;

  /**
   * Applies one or more query constraints to the current query resolver and
   * returns a new `QueryResolver` instance. How constraints are defined and
   * applied is determined by the adaptor.
   *
   * @param constraints - One or more `Constraint<A>` objects to apply to the query.
   * @returns A new `QueryResolver<A, S, T>` with the specified constraints applied.
   *
   * @example
   * ```typescript
   * const filteredResolver = resolver.constraints(where('field', '==', value), orderBy('field'));
   * const results = await filteredResolver(docRef).get();
   * ```
   */
  constraints(...constraints: Constraint<A>[]): QueryResolver<A, S, T> {
    return new QueryResolver(
      this._adaptor,
      (sourceRef: DocRef<A, S>): QueryRef<A, T> => {
        const ref = this._resolveQuery(sourceRef);
        return this._adaptor.query(ref, constraints);
      }
    );
  }

  /**
   * Applies a query transformation to the current query.
   * How the query is extended depends on the underlying adaptor.
   *
   * @param getQuery - A function that receives the current collection or query
   * reference and returns a new query reference with additional query constraints.
   * @returns A new `QueryResolver` instance configured with the transformed query.
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
  ): QueryResolver<A, S, T> {
    return new QueryResolver(this._adaptor, (sourceRef) => {
      const queryRef = this._resolveQuery(sourceRef);
      return getQuery(queryRef);
    });
  }
}
