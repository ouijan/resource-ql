import { of } from 'rxjs';
import {
  TestAdaptor,
  TestColRef,
  TestQueryRef,
} from '../testing/testing-adaptor';
import { Query } from './query';

describe('Query', () => {
  type T = string;
  let adaptor: TestAdaptor;
  //   let docRef: TestDocRef<T>;
  let colRef: TestColRef<T>;
  let queryRef: TestQueryRef<T>;

  beforeEach(() => {
    adaptor = new TestAdaptor();
    // docRef = { id: '1', data: 'hello world' };
    colRef = { id: 'posts' };
    queryRef = { col: colRef, constraints: [] };
  });

  describe('constructor', () => {
    it('should create a new Query', () => {
      const query = new Query(adaptor, queryRef);
      expect(query).toBeInstanceOf(Query);
    });
  });

  describe('get', () => {
    it('should call adaptor.docs with correct arguments and return result', async () => {
      const query = new Query(adaptor, queryRef);
      const docsResult = ['doc1', 'doc2'];
      adaptor.docs.mockResolvedValueOnce(docsResult);

      const result = await query.get();

      expect(adaptor.docs).toHaveBeenCalledWith(queryRef, [], undefined);
      expect(result).toBe(docsResult);
    });

    it('should pass transaction to adaptor.docs', async () => {
      const query = new Query(adaptor, queryRef);
      const transaction = {} as any;
      adaptor.docs.mockResolvedValueOnce([]);

      await query.get(transaction);

      expect(adaptor.docs).toHaveBeenCalledWith(queryRef, [], transaction);
    });
  });

  describe('get$', () => {
    it('should call adaptor.docs$ with correct arguments and return observable', (done) => {
      const query = new Query(adaptor, queryRef);
      const data = ['a', 'b', 'c'];
      adaptor.docs$.mockReturnValueOnce(of(data));

      query.get$().subscribe((result) => {
        expect(adaptor.docs$).toHaveBeenCalledWith(queryRef, []);
        expect(result).toBe(data);
        done();
      });
    });
  });

  describe('constraints', () => {
    it('should call adaptor.query with constraints and return new Query', () => {
      const query = new Query(adaptor, queryRef);
      const constraint = { field: 'foo', op: '==', value: 'bar' } as any;
      const newQueryRef = { col: colRef, constraints: [constraint] };

      adaptor.query.mockReturnValueOnce(newQueryRef);

      const newQuery = query.constraints(constraint);

      expect(adaptor.query).toHaveBeenCalledWith(queryRef, [constraint]);
      expect(newQuery).toBeInstanceOf(Query);
      expect(newQuery.ref).toBe(newQueryRef);
    });
  });

  describe('query', () => {
    it('should apply getQuery function and return new Query', () => {
      const query = new Query(adaptor, queryRef);
      const newQueryRef: TestQueryRef<T> = {
        col: colRef,
        constraints: [{ constraintId: 'x' }],
      };
      const getQuery = jest.fn().mockReturnValue(newQueryRef);

      const newQuery = query.query(getQuery);

      expect(getQuery).toHaveBeenCalledWith(queryRef);
      expect(newQuery).toBeInstanceOf(Query);
      expect(newQuery.ref).toBe(newQueryRef);
    });
  });
});
