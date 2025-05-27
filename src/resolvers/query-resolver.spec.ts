import {
  TestAdaptor,
  TestColRef,
  TestConstraint,
  TestDocRef,
  TestQueryRef,
} from '../testing/testing-adaptor';
import { Query } from '../accessors/query';
import { QueryResolver } from './query-resolver';

describe('QueryResolver', () => {
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

  describe('create()', () => {
    it('should create a QueryResolver with the given adaptor and query resolver function', () => {
      const resolver = QueryResolver.create(adaptor, () => queryRef);
      expect(resolver).toBeInstanceOf(QueryResolver);
    });
  });

  describe('resolve()', () => {
    it('should resolve a Query from a DocRef', () => {
      const resolver = QueryResolver.create(adaptor, () => queryRef);
      const query = resolver.resolve(docRef);
      expect(query).toBeInstanceOf(Query);
      // Optionally check that the query was constructed with the correct adaptor and ref
      //   expect(query._adaptor).toBe(adaptor);
      //   expect(query._ref).toBe(queryRef);
    });
  });

  describe('constraints', () => {
    it('should return a new QueryResolver with constraints applied', () => {
      const constraint: TestConstraint = { constraintId: 'foo' };
      const resolver = QueryResolver.create(adaptor, () => queryRef);
      const constrainedResolver = resolver.constraints(constraint);
      expect(constrainedResolver).toBeInstanceOf(QueryResolver);

      // Should apply the constraint when resolving
      const spy = jest.spyOn(adaptor, 'query');
      constrainedResolver.resolve(docRef);
      expect(spy).toHaveBeenCalledWith(queryRef, [constraint]);
    });

    it('should allow chaining multiple constraints', () => {
      const c1: TestConstraint = { constraintId: 'a' };
      const c2: TestConstraint = { constraintId: 'b' };
      const resolver = QueryResolver.create(adaptor, () => queryRef);
      const constrainedResolver = resolver.constraints(c1, c2);
      const spy = jest.spyOn(adaptor, 'query');
      constrainedResolver.resolve(docRef);
      expect(spy).toHaveBeenCalledWith(queryRef, [c1, c2]);
    });
  });

  describe('query', () => {
    it('should return a new QueryResolver with a transformed query', () => {
      const transformedQueryRef = {
        col: colRef,
        constraints: [{ type: 'where', field: 'x', op: '>', value: 5 }],
      } as any;
      const resolver = QueryResolver.create(adaptor, () => queryRef);
      const getQuery = jest.fn().mockReturnValue(transformedQueryRef);
      const newResolver = resolver.query(getQuery);
      expect(newResolver).toBeInstanceOf(QueryResolver);

      const result = newResolver.resolve(docRef);
      expect(getQuery).toHaveBeenCalledWith(queryRef);
      expect(result).toBeInstanceOf(Query);
      expect(result.ref).toBe(transformedQueryRef);
    });
  });
});
