import { IAdaptor } from './adaptor/adaptor';
import { AdaptorTypes } from './adaptor/adaptor-types';
import { IDocResolver } from './interfaces/doc-resolver';
import { DocResolver } from './resolvers/doc-resolver';

/**
 * The entry point for constructing a resource. The returned {@link IDocResolver}
 * is resolved directly from the source reference. It is open to extensions
 * by chaining methods together to create a query. This query can then be
 * saved to a function variable can called later
 *
 * @remarks Its recommended to wrap this function in a method to easily create
 * resources with a predefined adaptor.
 *
 * @typeParam T - The type of the resource data.
 * @typeParam A - The adaptor type, constrained to {@link AdaptorTypes}.
 *
 * @param adaptor - An instance of {@link IAdaptor} for the specified adaptor type.
 *
 * @example
 * ```typescript
 * function resource<T>(): IDocResolver<FirestoreAdaptorTypes, T, T> {
 *    return NewResource<FirestoreAdaptorTypes, T>(new FirestoreAdaptor())
 * }
 *
 * // Define a resource for a user document
 * const getUsersFirstPost = resource<IUser>().col('posts').constraints(
 *   where('isFirstPost', '==', true)
 * );
 *
 * // Usage example
 * const firstPost = await getUsersFirstPost(userRef);
 * ```
 */
export function NewResource<A extends AdaptorTypes, T>(
  adaptor: IAdaptor<A>
): IDocResolver<A, T, T> {
  return DocResolver.create<A, T, T>(adaptor, (sourceRef) => sourceRef);
}
