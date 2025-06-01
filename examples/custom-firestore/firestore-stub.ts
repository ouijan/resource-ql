import { type Observable } from 'rxjs';

export type CollectionReference<T> = Query<T> & { collectionReference: T };
export type DocumentReference<_T> = { path: string; id: string };
export type Query<T> = { query: T };
export type QueryConstraint = { queryConstraint: 'queryConstraint' };
export type Transaction = { transaction: 'transaction' };

export function where(
  _key: string,
  _compare: string,
  _value: any
): QueryConstraint {
  throw new Error('Method not implemented.');
}
export function limit(_count: number): QueryConstraint {
  throw new Error('Method not implemented.');
}

export function undeletedQuery<T extends { deleted: boolean }>(
  _col: CollectionReference<T> | Query<T>,
  ..._queryConstraints: QueryConstraint[]
): Query<T> {
  throw new Error('Method not implemented.');
}

export function collectionGroupQuery<T>(
  _collectionId: string,
  ..._queryConstraints: QueryConstraint[]
): Query<T> {
  throw new Error('Method not implemented.');
}

export function queryFirestore<T>(
  _collectionRef: CollectionReference<T> | Query<T>,
  ..._queryConstraints: QueryConstraint[]
): Query<T> {
  throw new Error('Method not implemented.');
}

export function all$<T>(
  _ref: CollectionReference<T> | Query<T>
): Observable<T[]> {
  throw new Error('Method not implemented.');
}

export function subCollection<T>(
  _ref: DocumentReference<any>,
  _path: string
): CollectionReference<T> {
  throw new Error('Method not implemented.');
}

export class Firestore {
  static getDoc<T>(_ref: DocumentReference<T>): Promise<T> {
    throw new Error('Method not implemented.');
  }

  static doc$<T>(_ref: DocumentReference<T>): Observable<T> {
    throw new Error('Method not implemented.');
  }

  static safeGetDoc<T>(_ref: DocumentReference<T>): Promise<T | undefined> {
    throw new Error('Method not implemented.');
  }

  static safeDoc$<T>(_ref: DocumentReference<T>): Observable<T | undefined> {
    throw new Error('Method not implemented.');
  }

  static docExists(_ref: DocumentReference<any>): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  static getParentDocRef<P>(
    _ref: DocumentReference<any>
  ): DocumentReference<P> {
    throw new Error('Method not implemented.');
  }

  static getDocs(
    _ref: CollectionReference<any> | Query<any>,
    _queryConstraints: QueryConstraint[],
    _transaction?: Transaction
  ): Promise<any[]> {
    // use FirestoreTransactionHelper if a transaction is passed in
    throw new Error('Method not implemented.');
  }

  static doc<T>(
    _ref: CollectionReference<T>,
    _id: string
  ): DocumentReference<T> {
    throw new Error('Method not implemented.');
  }

  static docRef<T>(
    _ref: CollectionReference<T>,
    _id: string
  ): DocumentReference<T> {
    throw new Error('Method not implemented.');
  }
}
