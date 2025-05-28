// import { AdaptorTypes } from '../adaptor';

import { Query } from '../accessors/query';
import { IAdaptor } from '../adaptor/adaptor';
import { AdaptorTypes, DocRef, QueryRef } from '../adaptor/adaptor-types';
import { IQuery } from '../interfaces/query';
import { IQueryWithResolver } from '../interfaces/query-with-resolver';
import { MakeResolverWith, PropertiesOf } from './resolver';

export class QueryWithResolver<A extends AdaptorTypes, S, T, Arg>
  implements PropertiesOf<IQueryWithResolver<A, S, T, Arg>>
{
  static create<A extends AdaptorTypes, S, T, Arg>(
    adaptor: IAdaptor<A>,
    resolveQueryWith: (source: DocRef<A, S>, arg: Arg) => QueryRef<A, T>
  ): IQueryWithResolver<A, S, T, Arg> {
    const base = new QueryWithResolver<A, S, T, Arg>(adaptor, resolveQueryWith);
    return MakeResolverWith(base, base.resolve);
  }

  private constructor(
    private _adaptor: IAdaptor<A>,
    public _resolveQueryWith: (source: DocRef<A, S>, arg: Arg) => QueryRef<A, T>
  ) {}

  resolve(source: DocRef<A, S>, arg: Arg): IQuery<A, T> {
    return new Query(this._adaptor, this._resolveQueryWith(source, arg));
  }
}
