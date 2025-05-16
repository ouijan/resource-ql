import { Observable } from 'rxjs';

/**
 * Represents a collection of type aliases for adaptor entities.
 *
 * This utility type allows you to specify concrete types for each entity
 * when implementing an adaptor, enabling strong typing and flexibility.
 *
 * @see {@link DocRef}
 * @see {@link QueryRef}
 * @see {@link ColRef}
 * @see {@link Constraint}
 * @see {@link Transaction}
 *
 * @typeParam DocRef - The type representing a document reference. Used internally as `DocRef`.
 * @typeParam QueryRef - The type representing a query reference. Used internally as `QueryRef`.
 * @typeParam ColRef - The type representing a collection reference. Used internally as `ColRef`.
 * @typeParam Constraint - The type representing a query constraint. Used internally as `Constraint`.
 * @typeParam Transaction - The type representing a transaction. Used internally as `Transaction`.
 *
 * @example
 * ```typescript
 * type MyAdaptorTypes = AdaptorTypes<
 *  MyDocRef,
 *  MyQueryRef,
 *  MyColRef,
 *  MyConstraint,
 *  MyTransaction
 * >;
 * ```
 *
 * @category Types
 */
export type AdaptorTypes<
  DocRef = unknown,
  QueryRef = unknown,
  ColRef = unknown,
  Constraint = unknown,
  Transaction = unknown
> = {
  /** @hidden */
  DocRef: DocRef;

  /** @hidden */
  ColRef: ColRef;

  /** @hidden */
  QueryRef: QueryRef;

  /** @hidden */
  Constraint: Constraint;

  /** @hidden */
  Transaction: Transaction;
};

/**
 * Extracts the `DocRef` type from the provided {@link AdaptorTypes}.
 * Allows strict typing of document references.
 *
 * @typeParam A - An adaptor type that includes a `DocRef` type.
 * @typeParam _T - The document type.
 *
 * @category Types
 * @internal
 */
export type DocRef<A extends AdaptorTypes, _T> = A['DocRef'];

/**
 * Extracts the `QueryRef` type from the provided {@link AdaptorTypes}.
 * Allows strict typing of query references.
 *
 * @typeParam A - An adaptor type that includes a `QueryRef` type.
 * @typeParam _T - The query type.
 *
 * @category Types
 * @internal
 */
export type QueryRef<A extends AdaptorTypes, _T> = A['QueryRef'];

/**
 * Extracts the `ColRef` type from the provided {@link AdaptorTypes}.
 * Allows strict typing of collection references.
 *
 * @typeParam A - An adaptor type that includes a `ColRef` type.
 * @typeParam _T - The collection type.
 *
 * @category Types
 * @internal
 */
export type ColRef<A extends AdaptorTypes, _T> = A['ColRef'];

/**
 * Extracts the `Constraint` type from the provided {@link AdaptorTypes}.
 *
 * @typeParam A - An adaptor type that includes a `Constraint` type.
 *
 * @category Types
 * @internal
 */
export type Constraint<A extends AdaptorTypes> = A['Constraint'];

/**
 * Extracts the `Transaction` type from the provided {@link AdaptorTypes}.
 *
 * @typeParam A - An adaptor type that includes a `Transaction` type.
 *
 * @category Types
 * @internal
 */
export type Transaction<A extends AdaptorTypes> = A['Transaction'];

/**
 * Interface representing an adaptor for Firestore-like data sources.
 * Provides methods for referencing, querying, and observing documents and collections.
 *
 * @typeParam A - The adaptor type, extending `AdaptorTypes`.
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
