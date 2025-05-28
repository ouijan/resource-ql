import {
  TestAdaptor,
  TestColRef,
  TestDocRef,
  TestQueryRef,
} from '../testing/testing-adaptor';
import { QueryWithResolver } from './query-with-resolver';

describe('QueryWithResolver', () => {
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

  describe('create', () => {
    it('should create an instance', () => {
      const resolveQueryWith = jest.fn().mockReturnValue(queryRef);
      const instance = QueryWithResolver.create(adaptor, resolveQueryWith);
      expect(instance).toBeDefined();
      expect(typeof instance.resolve).toBe('function');
    });
  });

  describe('resolve', () => {
    it('should call resolveQueryWith and return a Query on resolve', () => {
      const resolveQueryWith = jest.fn().mockReturnValue(queryRef);
      const instance = QueryWithResolver.create(adaptor, resolveQueryWith);
      const arg = { foo: 'bar' };
      const result = instance.resolve(docRef, arg);
      expect(resolveQueryWith).toHaveBeenCalledWith(docRef, arg);
      expect(result).toBeDefined();
      expect(result.constructor.name).toBe('Query');
    });

    it('should pass correct arguments to resolveQueryWith', () => {
      const resolveQueryWith = jest.fn().mockReturnValue(queryRef);
      const instance = QueryWithResolver.create(adaptor, resolveQueryWith);
      const arg = { test: 123 };
      instance.resolve(docRef, arg);
      expect(resolveQueryWith).toHaveBeenCalledWith(docRef, arg);
    });

    it('should use the provided adaptor in Query', () => {
      const resolveQueryWith = jest.fn().mockReturnValue(queryRef);
      const instance = QueryWithResolver.create(adaptor, resolveQueryWith);
      const result = instance.resolve(docRef, {});
      // @ts-ignore
      expect(result._adaptor).toBe(adaptor);
    });

    it('should expose _resolveQueryWith function', () => {
      const resolveQueryWith = jest.fn().mockReturnValue(queryRef);
      // @ts-ignore
      const instance = new QueryWithResolver(adaptor, resolveQueryWith);
      expect(instance._resolveQueryWith).toBe(resolveQueryWith);
    });
  });
});
