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
 * @group Adaptor
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
 * @group Adaptor
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
 * @group Adaptor
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
 * @group Adaptor
 * @internal
 */
export type ColRef<A extends AdaptorTypes, _T> = A['ColRef'];

/**
 * Extracts the `Constraint` type from the provided {@link AdaptorTypes}.
 *
 * @typeParam A - An adaptor type that includes a `Constraint` type.
 *
 * @group Adaptor
 * @internal
 */
export type Constraint<A extends AdaptorTypes> = A['Constraint'];

/**
 * Extracts the `Transaction` type from the provided {@link AdaptorTypes}.
 *
 * @typeParam A - An adaptor type that includes a `Transaction` type.
 *
 * @group Adaptor
 * @internal
 */
export type Transaction<A extends AdaptorTypes> = A['Transaction'];
