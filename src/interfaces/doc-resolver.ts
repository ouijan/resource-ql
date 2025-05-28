import { AdaptorTypes, DocRef, QueryRef } from '../adaptor/adaptor-types';
import { IColResolver } from './col-resolver';
import { IDoc } from './doc';
import { IQueryResolver } from './query-resolver';

/**
 * Resolves document references and provides methods to navigate document
 * relationships and collections.
 *
 * @typeParam A - The adaptor type, extending `AdaptorTypes`.
 * @typeParam S - The source document data type.
 * @typeParam T - The target document data type after resolution..
 *
 * @example
 * ```typescript
 * const resolver: IDocResolver = ... // Create a resolver
 * const parentResolver = resolver.parent();
 * const doc = resolver(docRef);
 * const colResolver = resolver.col('subcollection');
 * ```
 *
 * @group Resolvers
 * @internal
 */
export interface IDocResolver<A extends AdaptorTypes, S, T> {
  /**
   * Creates a new `IDocResolver` instance that resolves the parent document
   * reference of the current document. This is useful for traversing up one
   * level in a document hierarchy.
   *
   * @typeParam P - The type of the parent document's data.
   * @returns A new `IDocResolver` configured to resolve the parent document reference.
   *
   * @example
   * ```typescript
   * const parentResolver = resolver.parent<ParentType>();
   * const parentDoc = await parentResolver(docRef).get();
   * ```
   */
  parent<P>(): IDocResolver<A, S, P>;

  /**
   * Resolves a document reference from the given document reference and
   * returns a new `IDoc`. However, the preferred method to do this is by
   * invoking the IDocResolver directly.
   *
   * @param source - The document reference to resolve.
   * @returns A new `IDoc` corresponding to the resolved reference.
   *
   * @example
   * ```typescript
   * const data = await resolver(docRef).get() // Called directly (preferred)
   * const data = await resolver.resolve(docRef).get() // Called as a function
   * ```
   */
  resolve(source: DocRef<A, S>): IDoc<A, T>;
  (docRef: DocRef<A, S>): IDoc<A, T>;

  /**
   * Resolves a collection reference from the given document reference and
   * returns a new `IColResolver`. This allows for further querying or
   * manipulation of the collection.
   *
   * @param colPath - The path to the subcollection.
   * @returns A new `IColResolver` associated with the resolved collection reference.
   *
   * @example
   * ```typescript
   * const accountResolver: IDocResolver<Types, IUser, IAccount>;
   * const postsResolver = accountResolver.col('posts');
   * const posts = await colResolver(docRef).get();
   * ```
   */
  col<C>(colPath: string): IColResolver<A, S, C>;

  /**
   * Extends the current document reference to a new `IQueryResolver`. Allowing
   * further extension or resolving of the query from the source document.
   * Construction of the query depends on the underlying adaptor.
   *
   * @remarks This could be particularly useful when used with a Firestore
   * 'collectionGroup' query or other pre-defined `IQueryResolvers`
   *
   * @param getQuery - A function that receives the current document reference
   * and returns a new query reference with additional query constraints.
   * @returns A new `IQueryResolver` configured with the transformed query.
   *
   * @example
   * ```typescript
   * const accountResolver: IDocResolver<Types, IUser, IAccount>;
   * const postsResolver = accountResolver.query(
   *  (account) => newQuery('posts').where('accountRef', '==', account)
   * );
   * ```
   */
  query<C>(
    getQuery: (source: DocRef<A, T>) => QueryRef<A, C>
  ): IQueryResolver<A, S, C>;
}
