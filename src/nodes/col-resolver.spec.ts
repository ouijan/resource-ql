import {
  TestAdaptor,
  TestColRef,
  TestConstraint,
  TestDocRef,
  TestQueryRef,
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
});
