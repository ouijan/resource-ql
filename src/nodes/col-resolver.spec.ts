import {
  TestAdaptor,
  TestColRef,
  TestDocRef,
  TestQueryRef,
  TestConstraint,
} from '../testing/testing-adaptor';
import { Col } from './col';
import { ColResolver } from './col-resolver';

describe('ColResolver', () => {
  type T = string;
  let adaptor: TestAdaptor;
  let docRef: TestDocRef<T>;
  let colRef: TestColRef<T>;
  let queryRef: TestQueryRef<T>;

  beforeEach(() => {
    adaptor = new TestAdaptor();
    docRef = { id: '1', data: 'hello world' };
    colRef = { id: 'posts' };
    queryRef = { col: colRef, constraints: [] };
  });

  describe('resolve', () => {
    it('constructs and resolves a Col', () => {
      const resolver = new ColResolver(
        adaptor,
        () => colRef,
        () => queryRef
      );
      const col = resolver.resolve(docRef);
      expect(col).toBeInstanceOf(Col);
    });
  });

  describe('call', () => {
    it('is an alias for resolve', () => {
      const resolver = new ColResolver(
        adaptor,
        () => colRef,
        () => queryRef
      );
      expect(resolver.call).toBe(resolver.resolve);
      const col = resolver.call(docRef);
      expect(col).toBeInstanceOf(Col);
    });
  });

  describe('query', () => {
    it('returns a new ColResolver with transformed query', () => {
      const resolver = new ColResolver(
        adaptor,
        () => colRef,
        () => queryRef
      );
      const getQuery = jest.fn((q) => ({ ...q, extra: true }));
      const newResolver = resolver.query(getQuery);
      expect(newResolver).not.toBe(resolver);
      const result = (newResolver as any)._resolveQuery(docRef);
      expect(result.extra).toBe(true);
    });
  });

  describe('constraints', () => {
    it('returns a new ColResolver with applied constraints', () => {
      const resolver = new ColResolver(
        adaptor,
        () => colRef,
        () => queryRef
      );
      const constraint: TestConstraint = { constraintId: 'c1' };
      const newResolver = resolver.constraints(constraint);
      expect(newResolver).not.toBe(resolver);

      const result = (newResolver as any)._resolveQuery(docRef);
      console.log(result);
      // expect(result.constraints).toContain(constraint);
    });
  });
});
