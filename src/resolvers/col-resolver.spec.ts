import {
  TestAdaptor,
  TestColRef,
  TestConstraint,
  TestDocRef,
  TestQueryRef,
} from '../testing/testing-adaptor';
import { Col } from '../accessors/col';
import { ColResolver } from './col-resolver';
import { Query } from '../accessors/query';

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

  describe('create()', () => {
    it('should create a ColResolver with the given adaptor and col resolver function', () => {
      const resolver = ColResolver.create(
        adaptor,
        () => colRef,
        () => queryRef
      );
      expect(resolver).toBeInstanceOf(ColResolver);
    });
  });

  describe('resolve', () => {
    it('constructs and resolves a Col', () => {
      const resolver = ColResolver.create(
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
      const resolver = ColResolver.create(
        adaptor,
        () => colRef,
        () => queryRef
      );
      expect(resolver.resolve).toBe(resolver.resolve);
      const col = resolver.resolve(docRef);
      expect(col).toBeInstanceOf(Col);
    });

    it('allows resolver to be called directly', () => {
      const resolver = ColResolver.create(
        adaptor,
        () => colRef,
        () => queryRef
      );
      const col = resolver(docRef);
      expect(col).toBeInstanceOf(Col);
    });
  });

  describe('query', () => {
    it('should return a new ColResolver with a transformed query', () => {
      const transformedQueryRef = {
        col: colRef,
        constraints: [{ type: 'where', field: 'x', op: '>', value: 5 }],
      } as any;
      const resolver = ColResolver.create(
        adaptor,
        () => colRef,
        () => queryRef
      );
      const getQuery = jest.fn().mockReturnValue(transformedQueryRef);
      const newResolver = resolver.query(getQuery);
      expect(newResolver).toBeInstanceOf(ColResolver);

      const result = newResolver.resolve(docRef);
      expect(getQuery).toHaveBeenCalledWith(queryRef);
      expect(result).toBeInstanceOf(Col);
      expect(result.ref).toBe(colRef);
      expect(result.queryRef).toEqual(transformedQueryRef);
    });
  });

  describe('constraints', () => {
    it('should return a new ColResolver with constraints applied', () => {
      const constraint: TestConstraint = {
        constraintId: 'foo',
      };
      const resolver = ColResolver.create(
        adaptor,
        () => colRef,
        () => queryRef
      );
      const constrainedResolver = resolver.constraints(constraint);
      expect(constrainedResolver).toBeInstanceOf(ColResolver);

      // Should apply the constraint when resolving
      const spy = jest.spyOn(adaptor, 'query');
      constrainedResolver.resolve(docRef);
      expect(spy).toHaveBeenCalledWith(queryRef, [constraint]);
    });

    it('should allow chaining multiple constraints', () => {
      const c1: TestConstraint = { constraintId: 'a' };
      const c2: TestConstraint = { constraintId: 'b' };
      const resolver = ColResolver.create(
        adaptor,
        () => colRef,
        () => queryRef
      );
      const constrainedResolver = resolver.constraints(c1, c2);
      const spy = jest.spyOn(adaptor, 'query');
      constrainedResolver.resolve(docRef);
      expect(spy).toHaveBeenCalledWith(queryRef, [c1, c2]);
    });
  });

  describe('queryWith', () => {
    it('should return an IQueryWithResolver that applies the query transformation with an argument', () => {
      const transformedQueryRef = {
        col: colRef,
        constraints: [{ type: 'where', field: 'amount', op: '>', value: 42 }],
      } as any;
      const resolver = ColResolver.create(
        adaptor,
        () => colRef,
        () => queryRef
      );
      const getQuery = jest.fn().mockReturnValue(transformedQueryRef);
      const queryWithResolver = resolver.queryWith<number>(getQuery);

      expect(queryWithResolver).toBeDefined();
      expect(typeof queryWithResolver.resolve).toBe('function');

      const query = queryWithResolver.resolve(docRef, 42);
      expect(getQuery).toHaveBeenCalledWith(queryRef, 42);
      expect(query).toBeInstanceOf(Query);
      expect(query.ref).toEqual(transformedQueryRef);
    });
  });

  describe('constraintsWith', () => {
    it('should return an IQueryWithResolver that applies constraints based on an argument', () => {
      const constraintFactory = jest
        .fn()
        .mockImplementation((arg: string) => [
          { constraintId: `where-amount-${arg}` },
        ]);
      const resolver = ColResolver.create(
        adaptor,
        () => colRef,
        () => queryRef
      );
      const queryWithResolver =
        resolver.constraintsWith<string>(constraintFactory);

      expect(queryWithResolver).toBeDefined();
      expect(typeof queryWithResolver.resolve).toBe('function');

      const spy = jest.spyOn(adaptor, 'query');
      const query = queryWithResolver.resolve(docRef, '100');
      expect(constraintFactory).toHaveBeenCalledWith('100');
      expect(spy).toHaveBeenCalledWith(queryRef, [
        { constraintId: 'where-amount-100' },
      ]);
      expect(query).toBeInstanceOf(Query);
    });

    it('should allow constraintsWith to work with different argument types', () => {
      const constraintFactory = jest
        .fn()
        .mockImplementation((arg: number) => [
          { constraintId: `where-amount-${arg}` },
        ]);
      const resolver = ColResolver.create(
        adaptor,
        () => colRef,
        () => queryRef
      );
      const queryWithResolver =
        resolver.constraintsWith<number>(constraintFactory);

      const spy = jest.spyOn(adaptor, 'query');
      const query = queryWithResolver.resolve(docRef, 123);
      expect(constraintFactory).toHaveBeenCalledWith(123);
      expect(spy).toHaveBeenCalledWith(queryRef, [
        { constraintId: 'where-amount-123' },
      ]);
      expect(query).toBeInstanceOf(Query);
    });
  });
});
