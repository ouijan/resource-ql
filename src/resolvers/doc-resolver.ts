import { Doc } from '../accessors/doc';
import { IAdaptor } from '../adaptor/adaptor';
import { AdaptorTypes, DocRef, QueryRef } from '../adaptor/adaptor-types';
import { IColResolver } from '../interfaces/col-resolver';
import { IDocResolver } from '../interfaces/doc-resolver';
import { IQueryResolver } from '../interfaces/query-resolver';
import { ColResolver } from './col-resolver';
import { QueryResolver } from './query-resolver';
import { MakeResolver, PropertiesOf } from './resolver';

export class DocResolver<A extends AdaptorTypes, S, T>
  implements PropertiesOf<IDocResolver<A, S, T>>
{
  static create<A extends AdaptorTypes, S, T>(
    adaptor: IAdaptor<A>,
    resolveRef: (source: DocRef<A, S>) => DocRef<A, T>
  ): IDocResolver<A, S, T> {
    const base = new DocResolver<A, S, T>(adaptor, resolveRef);
    return MakeResolver(base, base.resolve);
  }

  constructor(
    private _adaptor: IAdaptor<A>,
    public _resolveRef: (source: DocRef<A, S>) => DocRef<A, T>
  ) {}

  parent<P>(): IDocResolver<A, S, P> {
    return DocResolver.create(this._adaptor, (sourceRef) => {
      const targetRef = this._resolveRef(sourceRef);
      return this._adaptor.docParentRef<P, T>(targetRef);
    });
  }

  resolve(source: DocRef<A, S>): Doc<A, T> {
    return new Doc(this._adaptor, this._resolveRef(source));
  }

  col<C>(colPath: string): IColResolver<A, S, C> {
    const colResolver = (source: DocRef<A, S>) =>
      this._adaptor.colRef<C, T>(this._resolveRef(source), colPath);
    const queryResolver = (source: DocRef<A, S>) =>
      this._adaptor.castToQuery(colResolver(source));
    return ColResolver.create(this._adaptor, colResolver, queryResolver);
  }

  query<C>(
    getQuery: (source: DocRef<A, T>) => QueryRef<A, C>
  ): IQueryResolver<A, S, C> {
    return QueryResolver.create(this._adaptor, (sourceRef) => {
      const targetRef = this._resolveRef(sourceRef);
      return getQuery(targetRef);
    });
  }
}
