import { IAdaptor } from '../adaptor/adaptor';
import { IColResolver } from '../interfaces/col-resolver';
import { MakeResolver, PropertiesOf } from './resolver';
import { Col } from '../accessors/col';
import {
  AdaptorTypes,
  DocRef,
  ColRef,
  QueryRef,
  Constraint,
} from '../adaptor/adaptor-types';

export class ColResolver<A extends AdaptorTypes, S, T>
  implements PropertiesOf<IColResolver<A, S, T>>
{
  static create<A extends AdaptorTypes, S, T>(
    adaptor: IAdaptor<A>,
    resolveRef: (source: DocRef<A, S>) => ColRef<A, T>,
    resolveQuery: (source: DocRef<A, S>) => QueryRef<A, T>
  ): IColResolver<A, S, T> {
    const base = new ColResolver<A, S, T>(adaptor, resolveRef, resolveQuery);
    return MakeResolver(base, base.resolve);
  }

  private constructor(
    private _adaptor: IAdaptor<A>,
    private _resolveRef: (source: DocRef<A, S>) => ColRef<A, T>,
    private _resolveQuery: (source: DocRef<A, S>) => QueryRef<A, T>
  ) {}

  resolve(source: DocRef<A, S>): Col<A, T> {
    const ref = this._resolveRef(source);
    const queryRef = this._resolveQuery(source);
    return new Col(this._adaptor, ref, queryRef);
  }

  query(
    getQuery: (query: QueryRef<A, T>) => QueryRef<A, T>
  ): IColResolver<A, S, T> {
    return ColResolver.create(this._adaptor, this._resolveRef, (sourceRef) => {
      const queryRef = this._resolveQuery(sourceRef);
      return getQuery(queryRef);
    });
  }

  constraints(...constraints: Constraint<A>[]): IColResolver<A, S, T> {
    return ColResolver.create(this._adaptor, this._resolveRef, (sourceRef) => {
      const queryRef = this._resolveQuery(sourceRef);
      return this._adaptor.query(queryRef, constraints);
    });
  }
}
