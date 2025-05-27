import { Observable } from 'rxjs';
import { IAdaptor } from '../adaptor/adaptor';
import { AdaptorTypes } from '../adaptor/adaptor-types';
import {
  all$,
  CollectionReference,
  DocumentReference,
  Firestore,
  Query,
  QueryConstraint,
  queryFirestore,
  subCollection,
  Transaction,
} from './firestore-interfaces';

export type FirestoreAdaptorTypes = AdaptorTypes<
  DocumentReference<any>,
  Query<any>,
  CollectionReference<any>,
  QueryConstraint,
  Transaction
>;

export class FirestoreAdaptor implements IAdaptor<FirestoreAdaptorTypes> {
  docRef<T>(ref: CollectionReference<T>, id: string): DocumentReference<T> {
    return Firestore.doc<T>(ref, id);
  }

  colRef<C, D>(ref: DocumentReference<D>, id: string): CollectionReference<C> {
    return subCollection(ref, id);
  }

  docParentRef<Parent, Source>(
    ref: DocumentReference<Source>
  ): DocumentReference<Parent> {
    return Firestore.getParentDocRef<Parent>(ref);
  }

  docExists<T>(ref: DocumentReference<T>): Promise<boolean> {
    return Firestore.docExists(ref);
  }

  doc<T>(ref: DocumentReference<T>): Promise<T> {
    return Firestore.getDoc(ref);
  }

  doc$<T>(ref: DocumentReference<T>): Observable<T> {
    return Firestore.doc$(ref);
  }

  docs<T>(
    query: Query<T>,
    constraints: QueryConstraint[],
    transaction?: Transaction
  ): Promise<T[]> {
    return Firestore.getDocs(query, constraints, transaction);
  }

  docs$<T>(query: Query<T>, constraints: QueryConstraint[]): Observable<T[]> {
    return all$<T>(this.query(query, constraints));
  }

  query<T>(query: Query<T>, constraints: QueryConstraint[]): Query<T> {
    return queryFirestore(query, ...constraints);
  }

  castToQuery<T>(colRef: CollectionReference<T>): Query<T> {
    return colRef;
  }
}
