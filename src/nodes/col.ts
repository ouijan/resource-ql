import { Observable } from 'rxjs';
import {
  AdaptorTypes,
  ColRef,
  DocRef,
  IAdaptor,
  QueryRef,
  Transaction,
} from '../adaptor';
import { Doc } from './doc';

/**
 * Represents a collection abstraction, providing methods to query documents,
 * retrieve document references, and interact with document resources.
 *
 * @typeParam A - The adaptor type, extending `AdaptorTypes`.
 * @typeParam T - The document data type stored in the collection.
 *
 * @example
 * ```typescript
 * const usersCol: Col = ... // Create a collection reference
 * const users = await usersCol.get();
 * const userDoc = await usersCol.doc('userId').get();
 * ```
 *
 * @category Accessors
 * @hideconstructor @internal
 */
export class Col<A extends AdaptorTypes, T> {
  queryRef: ColRef<A, T> | QueryRef<A, T>;

  constructor(
    private _adaptor: IAdaptor<A>,
    public ref: ColRef<A, T>,
    queryRef?: QueryRef<A, T>
  ) {
    this.queryRef = queryRef ?? ref;
  }

  /**
   * Retrieves an array of documents of type `T` from the collection, matching
   * the current constraints. Constraints should have already been applied
   * before performing a get.
   *
   * @param transaction - An optional transaction to use for the retrieval.
   * @returns A promise that resolves to an array of documents matching the constraints.
   *
   * @example
   * ```typescript
   * const users = await usersCol.get();
   * const filteredUsers = await usersCol.get();
   * ```
   */
  get(transaction?: Transaction<A>): Promise<T[]> {
    return this._adaptor.docs(this.queryRef, [], transaction);
  }

  /**
   * Observes an array of documents of type `T` from the collection. Any
   * constraints should have already been applied before performing a get.
   *
   * @returns An observable that emits arrays of documents matching the constraints.
   *
   * @example
   * ```typescript
   * const users$ = usersCol.get$();
   * const filteredUsers$ = usersCol.get$();
   * ```
   */
  get$(): Observable<T[]> {
    return this._adaptor.docs$(this.queryRef, []);
  }

  /**
   * Returns a reference to a document within the current collection.
   *
   * @param id - The unique identifier of the document.
   * @returns A `DocRef<A, T>` representing the document reference.
   *
   * @example
   * ```typescript
   * const userDocRef = usersCol.docRef('userId');
   * ```
   */
  docRef(id: string): DocRef<A, T> {
    return this._adaptor.docRef(this.ref, id);
  }

  /**
   * Returns a `Doc` instance representing a document with the specified ID within the collection.
   *
   * @param id - The unique identifier of the document to retrieve.
   * @returns A `Doc<A, T>` instance for the specified document.
   *
   * @example
   * ```typescript
   * const userDoc = usersCol.doc('userId');
   * const userDocData = await userDoc.get();
   * ```
   */
  doc(id: string): Doc<A, T> {
    return new Doc(this._adaptor, this.docRef(id));
  }
}
