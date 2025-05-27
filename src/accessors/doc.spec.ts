import { of, throwError } from 'rxjs';
import {
  TestAdaptor,
  TestColRef,
  TestDocRef,
  TestQueryRef,
} from '../testing/testing-adaptor';
import { Doc } from './doc';
import { Col } from './col';
import { ColResolver } from '../resolvers/col-resolver';

describe('Doc', () => {
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

  describe('constructor', () => {
    it('can create a new Doc', () => {
      const doc = new Doc(adaptor, docRef);
      expect(doc).toBeInstanceOf(Doc);
    });
  });

  describe('get', () => {
    it('should retrieve document data', async () => {
      adaptor.doc.mockReturnValue('hello world');
      const doc = new Doc(adaptor, docRef);
      const data = await doc.get();
      expect(adaptor.doc).toHaveBeenCalledWith(docRef, undefined);
      expect(data).toBe('hello world');
    });
  });

  describe('get$', () => {
    it('should emit document data', (done) => {
      adaptor.doc$.mockReturnValue(of('hello world'));
      const doc = new Doc(adaptor, docRef);
      doc.get$().subscribe((data) => {
        expect(adaptor.doc$).toHaveBeenCalledWith(docRef);
        expect(data).toBe('hello world');
        done();
      });
    });
  });

  describe('tryGet', () => {
    it('should return document data if no error', async () => {
      adaptor.doc.mockReturnValue('hello world');
      const doc = new Doc(adaptor, docRef);
      const data = await doc.tryGet();
      expect(adaptor.doc).toHaveBeenCalledWith(docRef, undefined);
      expect(data).toBe('hello world');
    });

    it('should return undefined if an error occurs', async () => {
      adaptor.doc.mockImplementation(() => {
        throw new Error('fail');
      });
      const doc = new Doc(adaptor, docRef);
      const data = await doc.tryGet();
      expect(data).toBeUndefined();
    });
  });

  describe('tryGet$', () => {
    it('should emit document data if no error', (done) => {
      adaptor.doc$.mockReturnValue(of('hello world'));
      const doc = new Doc(adaptor, docRef);
      doc.tryGet$().subscribe((data) => {
        expect(adaptor.doc$).toHaveBeenCalledWith(docRef);
        expect(data).toBe('hello world');
        done();
      });
    });

    it('should emit undefined if an error occurs', (done) => {
      adaptor.doc$.mockImplementation(() =>
        throwError(() => new Error('fail'))
      );
      const doc = new Doc(adaptor, docRef);
      doc.tryGet$().subscribe((data) => {
        expect(data).toBeUndefined();
        done();
      });
    });
  });

  describe('exists', () => {
    it('should return true if document exists', async () => {
      adaptor.docExists.mockResolvedValue(true);
      const doc = new Doc(adaptor, docRef);
      const exists = await doc.exists();
      expect(exists).toBe(true);
    });

    it('should return false if document does not exist', async () => {
      adaptor.docExists.mockResolvedValue(false);
      const missingDocRef = { id: '2', data: undefined };
      const doc = new Doc(adaptor, missingDocRef);
      const exists = await doc.exists();
      expect(exists).toBe(false);
    });
  });

  describe('parent', () => {
    it('should return a Doc instance for the parent', () => {
      const doc = new Doc(adaptor, docRef);
      adaptor.docParentRef.mockReturnValue({
        id: 'parent',
        data: 'parent data',
      });
      const parentDoc = doc.parent<{ foo: string }>();
      expect(parentDoc).toBeInstanceOf(Doc);
    });
  });

  describe('col', () => {
    it('should return a ColResolver for a sub-collection', () => {
      const doc = new Doc(adaptor, docRef);

      adaptor.colRef.mockReturnValue(colRef);
      adaptor.castToQuery.mockReturnValue(queryRef);

      const colResolver = doc.col<T>('posts');
      expect(colResolver).toBeInstanceOf(ColResolver);
      expect(adaptor.colRef).toHaveBeenCalledWith(docRef, 'posts');

      const col = colResolver.resolve(docRef);
      expect(adaptor.castToQuery).toHaveBeenCalledWith(colRef);
      expect(col).toBeInstanceOf(Col);
      expect(col.ref).toBe(colRef);
      expect(col.queryRef).toBe(queryRef);
    });
  });
});
