import { IDocResolver } from 'src/interfaces/doc-resolver';
import { NewResource } from '../resource';
import { FirestoreAdaptor, FirestoreAdaptorTypes } from './firestore-adaptor';
import {
  DocumentReference,
  Query,
  QueryConstraint,
} from './firestore-interfaces';

interface Alpha {
  a: string;
}
interface Beta {
  b: string;
}
interface Gamma {
  c: string;
}

class Example {
  static from<T>(): IDocResolver<FirestoreAdaptorTypes, T, T> {
    return NewResource<FirestoreAdaptorTypes, T>(new FirestoreAdaptor());
  }

  static beta = this.from<Beta>();
  static alpha = this.beta.parent<Alpha>();
  static gammas = this.beta.col<Gamma>('gammas');
  static delta = this.beta.col<Gamma>('gammas').query((col) => col);
  static someGammas = this.gammas.constraints({} as QueryConstraint);
}

export async function test(): Promise<void> {
  const constraint = {} as QueryConstraint;

  const betaRef = {} as DocumentReference<Beta>;
  const beta = await Example.beta(betaRef).get();
  const alpha = await Example.alpha(betaRef).get();
  const gamma = await Example.someGammas(betaRef).get();

  Example.gammas.constraints(constraint);

  const queryFromDoc = Example.beta.query<Alpha>((docRef) => ({
    query: `could be a collection group query based on ${docRef}`,
  }));
  const queryWithArg = queryFromDoc.queryWith(
    (query: Query<Alpha>, _arg: string) => query
  );

  const doomed = await queryWithArg(betaRef, 'doomed').get();
  console.log({ beta, alpha, gamma, doomed });
}
