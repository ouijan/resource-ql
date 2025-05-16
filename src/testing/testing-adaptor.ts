import { AdaptorTypes, IAdaptor } from 'src/adaptor';

export type TestDocRef<T> = { id: string; data: T };
export type TestColRef<_T> = { id: string };
export type TestQueryRef<T> = {
  col: TestColRef<T>;
  constraints: TestConstraint[];
};
export type TestConstraint = { constraintId: string };
export type TestTransaction = { transactionId: string };

export type TestAdaptorTypes = AdaptorTypes<
  TestDocRef<any>,
  TestQueryRef<any>,
  TestColRef<any>,
  TestConstraint,
  TestTransaction
>;

// export type TestDocRef<T> =  = { path: string };
// export type TestColRef = { path: string };
// export type TestQueryRef = { path: string; query: boolean };
// export type TestTransactionRef = { transaction: string };
// export type TestDocRefRef = { ref: string; id: string };

export class TestAdaptor implements IAdaptor<TestAdaptorTypes> {
  docRef = jest.fn();
  colRef = jest.fn();
  docParentRef = jest.fn();
  docExists = jest.fn();
  doc = jest.fn();
  doc$ = jest.fn();
  docs = jest.fn();
  docs$ = jest.fn();
  query = jest.fn();
  castToQuery = jest.fn();
}
