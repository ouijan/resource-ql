import { Query } from '../accessors/query';
import { IAdaptor } from '../adaptor/adaptor';
import {
  AdaptorTypes,
  Constraint,
  DocRef,
  QueryRef,
} from '../adaptor/adaptor-types';
import { IQueryResolver } from '../interfaces/query-resolver';
import { MakeResolver, PropertiesOf } from './resolver';

export class QueryResolver<A extends AdaptorTypes, S, T>
  implements PropertiesOf<IQueryResolver<A, S, T>>
{
  static create<A extends AdaptorTypes, S, T>(
    adaptor: IAdaptor<A>,
    resolveQuery: (source: DocRef<A, S>) => QueryRef<A, T>
  ): IQueryResolver<A, S, T> {
    const base = new QueryResolver(adaptor, resolveQuery);
    return MakeResolver(base, base.resolve);
  }

  private constructor(
    private _adaptor: IAdaptor<A>,
    public _resolveQuery: (source: DocRef<A, S>) => QueryRef<A, T>
  ) {}

  resolve(source: DocRef<A, S>): Query<A, T> {
    const ref = this._resolveQuery(source);
    return new Query(this._adaptor, ref);
  }

  constraints(...constraints: Constraint<A>[]): IQueryResolver<A, S, T> {
    return QueryResolver.create(
      this._adaptor,
      (sourceRef: DocRef<A, S>): QueryRef<A, T> => {
        const ref = this._resolveQuery(sourceRef);
        return this._adaptor.query(ref, constraints);
      }
    );
  }

  query(
    getQuery: (query: QueryRef<A, T>) => QueryRef<A, T>
  ): IQueryResolver<A, S, T> {
    return QueryResolver.create(this._adaptor, (sourceRef) => {
      const queryRef = this._resolveQuery(sourceRef);
      return getQuery(queryRef);
    });
  }
}
