import { AdaptorTypes, IAdaptor } from './adaptor';
import { DocResolver } from './nodes/doc-resolver';

/**
 * The entry point for constructing a resource. Represents a generic resource
 * that extends the {@link DocResolver} class. The resource is resolved
 * directly from the source reference. It is open to extensions by chaining
 * methods together to create a query. This query can then be saved to a
 * function variable can called later
 *
 * @remarks Its recommended to wrap this function in a method to easily create
 * resources with a predefined adaptor.
 *
 * @typeParam T - The type of the resource data.
 * @typeParam A - The adaptor type, constrained to {@link AdaptorTypes}.
 *
 * @extends DocResolver<A, T, T>
 *
 * @param adaptor - An instance of {@link IAdaptor} for the specified adaptor type.
 *
 * @example
 * ```typescript
 * function resource<T>(): Resource<FirestoreAdaptorTypes, T> {
 *    return new Resource<IUser>(new FirestoreAdaptor())
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
 *
 */
export class Resource<T, A extends AdaptorTypes> extends DocResolver<A, T, T> {
  constructor(adaptor: IAdaptor<A>) {
    super(adaptor, (sourceRef) => sourceRef);
  }
}
