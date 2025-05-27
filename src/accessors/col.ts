import { Observable } from 'rxjs';
import { IAdaptor } from '../adaptor/adaptor';
import {
  AdaptorTypes,
  ColRef,
  DocRef,
  QueryRef,
  Transaction,
} from '../adaptor/adaptor-types';
import { ICol } from '../interfaces/col';
import { Doc } from './doc';

export class Col<A extends AdaptorTypes, T> implements ICol<A, T> {
  queryRef: ColRef<A, T> | QueryRef<A, T>;

  constructor(
    private _adaptor: IAdaptor<A>,
    public ref: ColRef<A, T>,
    queryRef?: QueryRef<A, T>
  ) {
    this.queryRef = queryRef ?? ref;
  }

  get(transaction?: Transaction<A>): Promise<T[]> {
    return this._adaptor.docs(this.queryRef, [], transaction);
  }

  get$(): Observable<T[]> {
    return this._adaptor.docs$(this.queryRef, []);
  }

  docRef(id: string): DocRef<A, T> {
    return this._adaptor.docRef(this.ref, id);
  }

  doc(id: string): Doc<A, T> {
    return new Doc(this._adaptor, this.docRef(id));
  }
}
