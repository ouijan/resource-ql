import { Callable, ICallable, MakeCallable } from '../callable';
import { AdaptorTypes, DocRef, IAdaptor, QueryRef } from '../adaptor';
import { CallableColResolver, ColResolver } from './col-resolver';
import { Doc } from './doc';
import { QueryResolver } from './query-resolver';

export type CallableDocResolver<A extends AdaptorTypes, S, T> = Callable<
  DocResolver<A, S, T>,
  DocRef<A, S>,
  Doc<A, T>
>;

/**
 * Resolves Firestore document references and provides methods to navigate
 * document relationships and collections.
 *
 * @typeParam A - The adaptor types used for Firestore operations.
 * @typeParam S - The source document data type.
 * @typeParam T - The target document data type after resolution..
 *
 * @example
 * ```typescript
 * const resolver: DocResolver = ... // Create a resolver
 * const parentResolver = resolver.parent();
 * const doc = resolver(docRef);
 * const colResolver = resolver.col('subcollection');
 * ```
 *
 * @category Resolvers
 * @hideconstructor @internal
 */
export class DocResolver<A extends AdaptorTypes, S, T>
  implements ICallable<DocRef<A, S>, Doc<A, T>>
{
  static create<A extends AdaptorTypes, S, T>(
    adaptor: IAdaptor<A>,
    resolveRef: (source: DocRef<A, S>) => DocRef<A, T>
  ): CallableDocResolver<A, S, T> {
    return MakeCallable(new DocResolver(adaptor, resolveRef));
  }

  constructor(
    private _adaptor: IAdaptor<A>,
    public _resolveRef: (source: DocRef<A, S>) => DocRef<A, T>
  ) {}

  /**
   * Creates a new `DocResolver` instance that resolves the parent document
   * reference of the current document. This is useful for traversing up one
   * level in a document hierarchy.
   *
   * @typeParam P - The type of the parent document's data.
   * @returns A new `DocResolver` configured to resolve the parent document reference.
   *
   * @example
   * ```typescript
   * const parentResolver = resolver.parent<ParentType>();
   * const parentDoc = await parentResolver(docRef).get();
   * ```
   */
  parent<P>(): CallableDocResolver<A, S, P> {
    return DocResolver.create(this._adaptor, (sourceRef) => {
      const targetRef = this._resolveRef(sourceRef);
      return this._adaptor.docParentRef<P, T>(targetRef);
    });
  }

  /**
   * Resolves a document reference from the given document reference and
   * returns a new `Doc` instance. However, the preferred method to do this is
   * by invoking the DocResolver directly.
   *
   * @see call
   *
   * @param source - The document reference to resolve.
   * @returns A new `Doc` instance corresponding to the resolved reference.
   *
   * @example
   * ```typescript
   * const data = await resolver(docRef).get() // Called directly (preferred)
   * const data = await resolver.call(docRef).get() // Called as a function
   * ```
   */
  resolve(source: DocRef<A, S>): Doc<A, T> {
    return new Doc(this._adaptor, this._resolveRef(source));
  }

  /**
   * Allows the DocResolver to be invoked directly, which is the preferred
   * method to resolve a document reference. Uses the `resolve` method
   * of the current instance.
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
   * Resolves a collection reference from the given document reference and
   * returns a new `ColResolver` instance. This allows for further querying
   * or manipulation of the collection.
   *
   * @param colPath - The path to the subcollection.
   * @returns A new `ColResolver` instance associated with the resolved collection reference.
   *
   * @example
   * ```typescript
   * const accountResolver: DocResolver<Types, IUser, IAccount>;
   * const postsResolver = accountResolver.col('posts');
   * const posts = await colResolver(docRef).get();
   * ```
   */
  col<C>(colPath: string): CallableColResolver<A, S, C> {
    const colResolver = (source: DocRef<A, S>) =>
      this._adaptor.colRef<C, T>(this._resolveRef(source), colPath);
    const queryResolver = (source: DocRef<A, S>) =>
      this._adaptor.castToQuery(colResolver(source));
    return ColResolver.create(this._adaptor, colResolver, queryResolver);
  }

  /**
   * Extends the current document reference to a new `QueryResolver` instance.
   * Allowing further extension or resolving of the query from the source document.
   * Construction of the query depends on the underlying adaptor.
   *
   * @remarks This could be particularly useful when used with a Firestore
   * 'collectionGroup' query or other pre-defined `QueryResolvers`
   *
   * @param getQuery - A function that receives the current document reference
   * and returns a new query reference with additional query constraints.
   * @returns A new `QueryResolver` instance configured with the transformed query.
   *
   * @example
   * ```typescript
   * const accountResolver: DocResolver<Types, IUser, IAccount>;
   * const postsResolver = accountResolver.query(
   *  (account) => newQuery('posts').where('accountRef', '==', account)
   * );
   * ```
   */
  query<C>(
    getQuery: (source: DocRef<A, T>) => QueryRef<A, C>
  ): QueryResolver<A, S, C> {
    return QueryResolver.create(this._adaptor, (sourceRef) => {
      const targetRef = this._resolveRef(sourceRef);
      return getQuery(targetRef);
    });
  }
}
