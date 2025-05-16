import { catchError, Observable, of } from 'rxjs';
import { AdaptorTypes, DocRef, IAdaptor, Transaction } from '../adaptor';
import { ColResolver } from './col-resolver';

/**
 * Represents a Firestore document reference with methods to fetch document
 * data, check existence, handle errors gracefully, navigate to parent
 * documents, and access sub-collections or queries.
 *
 * @typeParam A - The adaptor types used for Firestore operations.
 * @typeParam T - The type of the document's data.
 *
 * @example
 * ```typescript
 * const doc = new Doc(adaptor, docRef);
 * const data = await doc.get();
 * const exists = await doc.exists();
 * ```
 *
 * @category Accessors
 * @hideconstructor @internal
 */
export class Doc<A extends AdaptorTypes, T> {
  constructor(private _adaptor: IAdaptor<A>, public ref: DocRef<A, T>) {}

  /**
   * Retrieves the document data for the current reference.
   *
   * @param transaction - An optional transaction to use for the retrieval.
   * @returns A promise that resolves with the document data of type `T`.
   *
   * @example
   * ```typescript
   * const doc = new Doc(adaptor, docRef);
   * const data = await doc.get();
   * ```
   */
  get(transaction?: Transaction<A>): Promise<T> {
    return this._adaptor.doc(this.ref, transaction);
  }

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
  get$(): Observable<T> {
    return this._adaptor.doc$(this.ref);
  }

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
  async tryGet(transaction?: Transaction<A>): Promise<T | undefined> {
    try {
      return this.get(transaction);
    } catch (e) {
      return;
    }
  }

  /**
   * Returns an observable that emits the document data of type `T` or `undefined` if an error occurs.
   *
   * This method wraps the document observable with error handling, so that any errors encountered
   * during retrieval will result in `undefined` being emitted instead of an error being thrown.
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
  tryGet$(): Observable<T | undefined> {
    return this._adaptor.doc$(this.ref).pipe(catchError(() => of(undefined)));
  }

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
  exists(): Promise<boolean> {
    return this._adaptor.docExists(this.ref);
  }

  /**
   * Returns the parent document of the current document.
   *
   * @typeParam P - The type of the parent document's data.
   * @returns A new `Doc` instance representing the parent document.
   *
   * @example
   * ```typescript
   * const parentDoc = childDoc.parent();
   * ```
   */
  parent<P>(): Doc<A, P> {
    const ref = this._adaptor.docParentRef<P, T>(this.ref);
    return new Doc(this._adaptor, ref);
  }

  /**
   * Returns a `ColResolver` instance for a sub-collection of the current document.
   *
   * @typeParam C - The type of the documents in the sub-collection.
   * @param colPath - The path to the sub-collection relative to the current document.
   * @returns A `ColResolver` configured for the specified sub-collection.
   *
   * @example
   * ```typescript
   * const posts = await userDoc.col('posts').get();
   * ```
   */
  col<C>(colPath: string): ColResolver<A, T, C> {
    const colRef = this._adaptor.colRef<C, T>(this.ref, colPath);
    return new ColResolver(
      this._adaptor,
      () => colRef,
      () => this._adaptor.castToQuery(colRef)
    );
  }
}
