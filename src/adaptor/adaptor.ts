import { Observable } from 'rxjs';
import {
  AdaptorTypes,
  ColRef,
  Constraint,
  DocRef,
  QueryRef,
  Transaction,
} from './adaptor-types';

/**
 * Interface for adapting resource-ql operations to a specific backend or data source.
 *
 * This interface defines the contract for interacting with collections, documents, queries,
 * and transactions in a type-safe manner. It abstracts the underlying implementation details,
 * allowing resource-ql to work with various storage engines (such as Firestore, REST APIs, etc.).
 *
 * @typeParam A - The adaptor type, used to distinguish between different backend implementations.
 *
 * @remarks
 * You must implement your own adaptor that fulfills this interface to connect resource-ql
 * to your chosen backend. Each method should provide the logic necessary to translate
 * resource-ql operations into backend-specific actions.
 *
 * @example
 * ```typescript
 * class MyCustomAdaptor implements IAdaptor<MyAdaptorTypes> {
 *   // Implement all interface methods here...
 * }
 * ```
 * @group Adaptor
 */
export interface IAdaptor<A extends AdaptorTypes> {
  /**
   * Returns a document reference for a given collection reference and document ID.
   *
   * @typeParam T - The document type.
   * @param ref - The collection reference.
   * @param id - The document ID.
   * @returns The document reference.
   */
  docRef<T>(ref: ColRef<A, T>, id: string): DocRef<A, T>;

  /**
   * Returns a collection reference for a given document reference and collection ID.
   *
   * @typeParam Col - The collection type.
   * @typeParam Doc - The document type.
   * @param ref - The parent document reference.
   * @param id - The collection ID.
   * @returns The collection reference.
   */
  colRef<Col, Doc>(ref: DocRef<A, Doc>, id: string): ColRef<A, Col>;

  /**
   * Returns the parent document reference of a given document reference.
   *
   * @typeParam Parent - The parent document type.
   * @typeParam Source - The source document type.
   * @param ref - The child document reference.
   * @returns The parent document reference.
   */
  docParentRef<Parent, Source>(ref: DocRef<A, Source>): DocRef<A, Parent>;

  /**
   * Checks if a document exists at the given reference.
   *
   * @typeParam T - The document type.
   * @param ref - The document reference.
   * @returns A promise resolving to `true` if the document exists, otherwise `false`.
   */
  docExists<T>(ref: DocRef<A, T>): Promise<boolean>;

  /**
   * Retrieves the document data for a given document reference.
   *
   * @typeParam T - The document type.
   * @param ref - The document reference.
   * @param transaction - An optional transaction to use for the retrieval.
   * @returns A promise resolving to the document data.
   */
  doc<T>(ref: DocRef<A, T>, transaction?: Transaction<A>): Promise<T>;

  /**
   * Observes the document data for a given document reference.
   *
   * @typeParam T - The document type.
   * @param ref - The document reference.
   * @returns An observable emitting the document data.
   */
  doc$<T>(ref: DocRef<A, T>): Observable<T>;

  /**
   * Retrieves an array of documents matching the given query and constraints.
   *
   * @typeParam T - The document type.
   * @param query - The query reference.
   * @param constraints - Query constraints.
   * @param transaction - An optional transaction to use for the retrieval.
   * @returns A promise resolving to an array of documents.
   */
  docs<T>(
    query: QueryRef<A, T>,
    constraints: Constraint<A>[],
    transaction?: Transaction<A>
  ): Promise<T[]>;

  /**
   * Observes an array of documents matching the given query and constraints.
   *
   * @typeParam T - The document type.
   * @param query - The query reference.
   * @param constraints - Optional query constraints.
   * @returns An observable emitting arrays of documents.
   */
  docs$<T>(
    query: QueryRef<A, T>,
    constraints: Constraint<A>[]
  ): Observable<T[]>;

  /**
   * Returns a query reference with the specified constraints applied.
   *
   * @typeParam T - The document type.
   * @param query - The base query reference.
   * @param constraints - Query constraints to apply.
   * @returns The constrained query reference.
   */
  query<T>(query: QueryRef<A, T>, constraints: Constraint<A>[]): QueryRef<A, T>;

  /**
   * Casts a collection reference to a query reference.
   *
   * @typeParam T - The document type.
   * @param colRef - The collection reference.
   * @returns The query reference.
   */
  castToQuery<T>(colRef: ColRef<A, T>): QueryRef<A, T>;
}
