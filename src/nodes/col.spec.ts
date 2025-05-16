import { of } from 'rxjs';
import {
  TestAdaptor,
  TestColRef,
  TestAdaptorTypes,
  TestQueryRef,
  TestTransaction,
} from '../testing/testing-adaptor';
import { Col } from './col';
import { Doc } from './doc';

describe('Col', () => {
  type T = { id: string; name: string };

  let adaptor: TestAdaptor;
  let colRef: TestColRef<T>;
  let queryRef: TestQueryRef<T>;
  let col: Col<TestAdaptorTypes, T>;

  beforeEach(() => {
    adaptor = new TestAdaptor();
    adaptor.docs.mockResolvedValue([{ id: '1', name: 'Alice' }]);
    adaptor.docs$.mockReturnValue(of([{ id: '2', name: 'Bob' }]));
    adaptor.docRef.mockImplementation((ref, id) => ({ ref, id }));
    colRef = { id: 'users' };
    queryRef = { col: colRef, constraints: [] };
    col = new Col(adaptor, colRef, queryRef);
  });

  describe('constructor', () => {
    it('should set queryRef to provided queryRef', () => {
      expect(col.queryRef).toBe(queryRef);
    });

    it('should set colRef to ref if queryRef is not provided', () => {
      const col2 = new Col(adaptor, colRef);
      expect(col2.queryRef).toBe(colRef);
    });
  });

  describe('get', () => {
    it('should call adaptor.docs with queryRef and return documents', async () => {
      const result = await col.get();
      expect(adaptor.docs).toHaveBeenCalledWith(queryRef, [], undefined);
      expect(result).toEqual([{ id: '1', name: 'Alice' }]);
    });

    it('should pass transaction to adaptor.docs', async () => {
      const transaction: TestTransaction = { transactionId: 'tx1' };
      await col.get(transaction);
      expect(adaptor.docs).toHaveBeenCalledWith(queryRef, [], transaction);
    });
  });

  describe('get$', () => {
    it('should call adaptor.docs$ with queryRef and return observable', (done) => {
      const obs = col.get$();
      expect(adaptor.docs$).toHaveBeenCalledWith(queryRef, []);
      obs.subscribe((docs) => {
        expect(docs).toEqual([{ id: '2', name: 'Bob' }]);
        done();
      });
    });
  });

  describe('docRef', () => {
    it('should call adaptor.docRef with ref and id', () => {
      const docRef = col.docRef('abc');
      expect(adaptor.docRef).toHaveBeenCalledWith(colRef, 'abc');
      expect(docRef).toEqual({ ref: colRef, id: 'abc' });
    });
  });

  describe('doc', () => {
    it('should return a Doc instance with correct adaptor and docRef', () => {
      const docInstance = col.doc('xyz');
      expect(docInstance).toBeInstanceOf(Doc);
      expect(adaptor.docRef).toHaveBeenCalledWith(colRef, 'xyz');
    });
  });
});
