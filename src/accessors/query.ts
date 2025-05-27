import { Observable } from 'rxjs';
import { IAdaptor } from '../adaptor/adaptor';
import {
  AdaptorTypes,
  Constraint,
  QueryRef,
  Transaction,
} from '../adaptor/adaptor-types';
import { IQuery } from '../interfaces/query';

export class Query<A extends AdaptorTypes, T> implements IQuery<A, T> {
  constructor(private _adaptor: IAdaptor<A>, public ref: QueryRef<A, T>) {}

  get(transaction?: Transaction<A>): Promise<T[]> {
    return this._adaptor.docs(this.ref, [], transaction);
  }

  get$(): Observable<T[]> {
    return this._adaptor.docs$(this.ref, []);
  }

  constraints(...constraints: Constraint<A>[]): IQuery<A, T> {
    const query = this._adaptor.query(this.ref, constraints);
    return new Query(this._adaptor, query);
  }

  query(getQuery: (q: QueryRef<A, T>) => QueryRef<A, T>): IQuery<A, T> {
    const query = getQuery(this.ref);
    return new Query(this._adaptor, query);
  }
}
