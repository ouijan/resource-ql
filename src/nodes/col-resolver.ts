import {
  AdaptorTypes,
  IAdaptor,
  ColRef,
  Constraint,
  DocRef,
  QueryRef,
} from '../adaptor';
import { Col } from './col';

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
 * const resolver: ColResolver = ... // Create a resolver
 * const col = resolver(docRef); // Resolve from a document reference
 * const filteredResolver = resolver.constraints(...constraints);  // Extend
 * ```
 *
 * @category Resolvers
 * @hideconstructor @internal
 */
export class ColResolver<A extends AdaptorTypes, S, T> {
  constructor(
    private _adaptor: IAdaptor<A>,
    private _resolveRef: (source: DocRef<A, S>) => ColRef<A, T>,
    private _resolveQuery: (source: DocRef<A, S>) => QueryRef<A, T>
  ) {}

  /**
   * Resolves a collection reference from the given document reference and
   * returns a new `Col` instance. However, the preferred method to do this is
   * by invoking the ColResolver directly.
   *
   * @see call
   *
   * @param source - The document reference from which to resolve the collection.
   * @returns A new `Col` instance associated with the resolved collection reference.
   *
   * @example
   * ```typescript
   * const data = await resolver(docRef).get() // Called directly (preferred)
   * const data = await resolver.resolve(docRef).get()
   * ```
   */
  resolve(source: DocRef<A, S>): Col<A, T> {
    const ref = this._resolveRef(source);
    return new Col(this._adaptor, ref);
  }

  /**
   * Allows the ColResolver to be invoked directly, which is the preferred
   * method to resolve a collection reference. Reference to the `resolve`
   * method of the current instance.
   *
   * @see resolve
   *
   * @example
   * ```typescript
   * const data = await resolver(docRef).get() // called as a function
   * ```
   */
  call = this.resolve;

  /**
   * Applies a query transformation to the current collection or query reference.
   * How the query is extended depends on the underlying adaptor.
   *
   * @param getQuery - A function that receives the current collection and
   * returns a new query reference with additional query constraints.
   * @returns A new `ColResolver` instance configured with the transformed query.
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
  ): ColResolver<A, S, T> {
    return new ColResolver(this._adaptor, this._resolveRef, (sourceRef) => {
      const queryRef = this._resolveQuery(sourceRef);
      return getQuery(queryRef);
    });
  }

  /**
   * Applies one or more query constraints to the collection resolver and
   * returns a new `ColResolver` instance with the updated query logic.
   * How constraints are defined and applied is determined by the adaptor.
   *
   * @param constraints - One or more `Constraint<A>` objects to apply to the query.
   * @returns A new `ColResolver<A, S, T>` instance with the specified constraints applied.
   *
   * @example
   * ```typescript
   * const filteredResolver = resolver.constraints(
   *   where('amount', '>', '3.50'), // apply constraints
   *   orderBy('amount', 'desc') // apply additional constraints
   * );
   */
  constraints(...constraints: Constraint<A>[]): ColResolver<A, S, T> {
    return new ColResolver(this._adaptor, this._resolveRef, (sourceRef) => {
      const queryRef = this._resolveQuery(sourceRef);
      return this._adaptor.query(queryRef, constraints);
    });
  }
}
