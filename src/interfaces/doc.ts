import { Observable } from 'rxjs';
import { AdaptorTypes, DocRef, Transaction } from '../adaptor/adaptor-types';
import { IColResolver } from './col-resolver';

/**
 * Represents a document reference with methods to fetch document data, check
 * existence, handle errors gracefully, navigate to parent documents, and
 * access sub-collections or queries.
 *
 * @typeParam A - The adaptor type, extending `AdaptorTypes`.
 * @typeParam T - The type of the document's data.
 *
 * @example
 * ```typescript
 * const doc: IDoc = ... // Create a document reference
 * const data = await doc.get();
 * const exists = await doc.exists();
 * ```
 *
 * @group Accessors
 * @internal
 */
export interface IDoc<A extends AdaptorTypes, T> {
  ref: DocRef<A, T>;

  /**
   * Retrieves the document data for the current reference.
   *
   * @param transaction - An optional transaction to use for the retrieval.
   * @returns A promise that resolves with the document data of type `T`.
   *
   * @example
   * ```typescript
   * const data = await doc.get();
   * ```
   */
  get(transaction?: Transaction<A>): Promise<T>;

  /**
   * Returns an observable that emits the current value of the document referenced by this instance.
   *
   * @returns An observable that emits the document data of type `T`.
   *
   * @example
   * ```typescript
   * userDoc.get$().subscribe(data => {
   *   console.log('Document data:', data);
   * });
   * ```
   */
  get$(): Observable<T>;

  /**
   * Attempts to retrieve the document and returns its value. If an error
   * occurs during retrieval, returns `undefined` instead of throwing.
   *
   * @param transaction - An optional transaction to use for the retrieval.
   * @returns A promise that resolves to the document value of type `T`,
   * or `undefined` if an error occurs.
   *
   * @example
   * ```typescript
   * const userData = await userDoc.tryGet();
   * if (userData) {
   *   // handle the retrieved document
   * }
   * ```
   */
  tryGet(transaction?: Transaction<A>): Promise<T | undefined>;

  /**
   * Returns an observable that emits the document data of type `T` or
   * `undefined` if an error occurs. This method wraps the document observable
   * with error handling, so that any errors encountered during retrieval will
   * result in `undefined` being emitted instead of an error being thrown.
   *
   * @returns An observable emitting the document data or `undefined` on error.
   *
   * @example
   * ```typescript
   * userDoc.tryGet$().subscribe(data => {
   *   if (data) {
   *     console.log('Document data:', data);
   *   }
   * });
   * ```
   */
  tryGet$(): Observable<T | undefined>;

  /**
   * Checks whether the referenced document exists in the data store.
   *
   * @returns A promise that resolves to `true` if the document exists, or `false` otherwise.
   *
   * @example
   * ```typescript
   * if(await userDoc.exists()) {
   *   console.log('Document exists!');
   * }
   * ```
   */
  exists(): Promise<boolean>;

  /**
   * Returns the parent document of the current document.
   *
   * @typeParam P - The type of the parent document's data.
   * @returns A new `IDoc` representing the parent document.
   *
   * @example
   * ```typescript
   * const parentDoc = childDoc.parent();
   * ```
   */
  parent<P>(): IDoc<A, P>;

  /**
   * Returns a `IColResolver` for a sub-collection of the current document.
   *
   * @typeParam C - The type of the documents in the sub-collection.
   * @param colPath - The path to the sub-collection relative to the current document.
   * @returns A `IColResolver` configured for the specified sub-collection.
   *
   * @example
   * ```typescript
   * const posts = await userDoc.col('posts').get();
   * ```
   */
  col<C>(colPath: string): IColResolver<A, T, C>;
}
