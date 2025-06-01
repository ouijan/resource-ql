import { last, take } from 'lodash';
import * as Loki from 'lokijs';
import { nanoid } from 'nanoid';
import { from, Observable } from 'rxjs';
import { AdaptorTypes, IAdaptor, IDocResolver, NewResource } from '../../src';

type LokiDocRef<T extends object> = {
  collection: Loki.Collection<T>;
  path: string;
  id: number;
};

type LokiConstraint = {
  type: 'find' | 'where';
  val: any;
  uid?: string | number | undefined;
};

type LokiTransaction = unknown;

export type LokiAdaptorTypes = AdaptorTypes<
  LokiDocRef<any>,
  Loki.DynamicView<any>,
  Loki.Collection<any>,
  LokiConstraint,
  LokiTransaction
>;

const loki = new Loki('example.db');

export function getResource<T>(): IDocResolver<LokiAdaptorTypes, T, T> {
  return NewResource<LokiAdaptorTypes, T>(new LokiAdaptor(loki));
}

export class LokiAdaptor implements IAdaptor<LokiAdaptorTypes> {
  constructor(private _db: Loki) {}

  docRef<T extends object>(
    ref: Loki.Collection<any>,
    id: string
  ): LokiDocRef<T> {
    return {
      collection: ref,
      path: `${ref.name}/${id}`,
      id: parseInt(id, 10),
    };
  }

  colRef<Col extends object, Doc extends object>(
    ref: LokiDocRef<Doc>,
    id: string
  ): Loki.Collection<Col> {
    return this._db.getCollection<Col>(`${ref.path}/${id}`);
  }

  docParentRef<Parent extends object, Source extends object>(
    ref: LokiDocRef<Source>
  ): LokiDocRef<Parent> {
    const sourceColSegments = ref.collection.name.split('/');
    const parentDocSegments = take(
      sourceColSegments,
      sourceColSegments.length - 1
    );
    const parentColSegments = take(
      parentDocSegments,
      parentDocSegments.length - 1
    );
    const parentCol = this._db.getCollection<Parent>(
      parentColSegments.join('/')
    );
    const parentId = last(parentDocSegments) ?? '';
    return this.docRef(parentCol, parentId);
  }

  async docExists<T extends object>(ref: LokiDocRef<T>): Promise<boolean> {
    const response = ref.collection.get(ref.id);
    return !!response;
  }

  async doc<T>(
    ref: LokiDocRef<any>,
    _transaction?: LokiTransaction | undefined
  ): Promise<T> {
    return ref.collection.get(ref.id);
  }

  doc$<T>(ref: LokiDocRef<any>): Observable<T> {
    return from(this.doc<T>(ref));
  }

  async docs<T extends object>(
    query: Loki.DynamicView<T>,
    constraints: LokiConstraint[],
    _transaction?: LokiTransaction | undefined
  ): Promise<T[]> {
    const constrained = constraints.reduce(
      (view: Loki.DynamicView<T>, constraint) => view.applyFilter(constraint),
      query
    );
    return constrained.data();
  }

  docs$<T>(
    query: Loki.DynamicView<any>,
    constraints: LokiConstraint[]
  ): Observable<T[]> {
    return from(this.docs(query, constraints));
  }

  query<T extends object>(
    query: Loki.DynamicView<any>,
    constraints: LokiConstraint[]
  ): Loki.DynamicView<any> {
    return constraints.reduce(
      (view: Loki.DynamicView<T>, constraint) => view.applyFilter(constraint),
      query
    );
  }

  castToQuery<T extends object>(
    colRef: Loki.Collection<T>
  ): Loki.DynamicView<T> {
    return colRef.addDynamicView(nanoid());
  }
}
