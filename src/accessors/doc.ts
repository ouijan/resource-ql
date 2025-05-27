import { catchError, Observable, of } from 'rxjs';
import { IAdaptor } from '../adaptor/adaptor';
import { AdaptorTypes, DocRef, Transaction } from '../adaptor/adaptor-types';
import { IColResolver } from '../interfaces/col-resolver';
import { IDoc } from '../interfaces/doc';
import { ColResolver } from '../resolvers/col-resolver';

export class Doc<A extends AdaptorTypes, T> implements IDoc<A, T> {
  constructor(private _adaptor: IAdaptor<A>, public ref: DocRef<A, T>) {}

  get(transaction?: Transaction<A>): Promise<T> {
    return this._adaptor.doc(this.ref, transaction);
  }

  get$(): Observable<T> {
    return this._adaptor.doc$(this.ref);
  }

  async tryGet(transaction?: Transaction<A>): Promise<T | undefined> {
    try {
      return this.get(transaction);
    } catch (e) {
      return;
    }
  }

  tryGet$(): Observable<T | undefined> {
    return this._adaptor.doc$(this.ref).pipe(catchError(() => of(undefined)));
  }

  exists(): Promise<boolean> {
    return this._adaptor.docExists(this.ref);
  }

  parent<P>(): Doc<A, P> {
    const ref = this._adaptor.docParentRef<P, T>(this.ref);
    return new Doc(this._adaptor, ref);
  }

  col<C>(colPath: string): IColResolver<A, T, C> {
    const colRef = this._adaptor.colRef<C, T>(this.ref, colPath);
    return ColResolver.create(
      this._adaptor,
      () => colRef,
      () => this._adaptor.castToQuery(colRef)
    );
  }
}
