import { IDocResolver } from 'src/interfaces/doc-resolver';
import { NewResource } from '../resource';
import { FirestoreAdaptor, FirestoreAdaptorTypes } from './firestore-adaptor';
import { DocumentReference, QueryConstraint } from './firestore-interfaces';

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
  static someGammas = this.gammas.constraints({} as QueryConstraint);
}

export async function test(): Promise<void> {
  const constraint = {} as QueryConstraint;

  const betaRef = {} as DocumentReference<Beta>;
  const beta = await Example.beta.resolve(betaRef).get();
  const alpha = await Example.alpha.resolve(betaRef).get();
  const gamma = await Example.someGammas.resolve(betaRef).get();

  Example.gammas.constraints(constraint);

  console.log({ beta, alpha, gamma });
}
