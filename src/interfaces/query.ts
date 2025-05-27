import { Observable } from 'rxjs';
import {
  AdaptorTypes,
  Constraint,
  QueryRef,
  Transaction,
} from '../adaptor/adaptor-types';

/**
 * A query abstraction for retrieving collections of documents. This class
 * provides methods to fetch documents, observe document changes, and compose
 * queries with additional constraints. It delegates the actual data operations
 * to the provided adaptor, allowing for flexible backend implementations.
 *
 * @typeParam A - The adaptor type, extending `AdaptorTypes`, used to interact with the underlying data source.
 * @typeParam T - The type of the documents returned by the query.
 *
 * @example
 * ```typescript
 * const docs = await usersQuery.get();
 * const filteredQuery = usersQuery.constraints('verified', '==', true);
 * ```
 * @group Accessors
 * @internal
 */
export interface IQuery<A extends AdaptorTypes, T> {
  ref: QueryRef<A, T>;

  /**
   * Retrieves an array of documents of type `T` from the data source.
   * Constraints should have already been applied before performing a get.
   *
   * @param transaction - An optional transaction to use for the retrieval.
   * @returns A promise that resolves to an array of documents matching the constraints.
   *
   * @example
   * ```typescript
   * const users = await usersQuery.get();
   * ```
   */
  get(transaction?: Transaction<A>): Promise<T[]>;

  /**
   * Retrieves an observable stream of documents matching the current constraints.
   * Constraints should have already been applied before performing a get.
   *
   * @returns An Observable that emits arrays of documents of type `T` matching the constraints.
   *
   * @example
   * ```typescript
   * const users$ = usersQuery.get$();
   * const filteredUsers$ = usersQuery.get$(where('verified', '==', true));
   * ```
   */
  get$(): Observable<T[]>;

  /**
   * Applies one or more constraints to the current query and returns a new
   * `IQuery` with those constraints applied. How constraints are defined and
   * applied is determined by the adaptor.
   *
   * @param constraints - One or more `Constraint<A>` objects to filter or modify the query.
   * @returns A new `IQuery<A, T>` with the specified constraints applied.
   *
   * @example
   * ```typescript
   * const filteredQuery = usersQuery.constraints(where('verified', '==', true));
   * const results = await filteredQuery.get();
   * ```
   */
  constraints(...constraints: Constraint<A>[]): IQuery<A, T>;

  /**
   * Creates a new `IQuery` by applying a transformation function to the
   * current query reference. How constraints are defined and applied is
   * determined by the adaptor.
   *
   * @param getQuery - A function that receives the current `QueryRef<A, T>`
   * and returns a new `QueryRef<A, T>`.
   * @returns A new `IQuery<A, T>` constructed with the adapted query reference.
   *
   * @example
   * ```typescript
   * const filteredQuery = usersQuery.query((q) => q.where('verified', '==', true));
   * const results = await filteredQuery.get();
   * ```
   */
  query(getQuery: (q: QueryRef<A, T>) => QueryRef<A, T>): IQuery<A, T>;
}
