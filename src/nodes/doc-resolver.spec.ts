import {
  TestAdaptor,
  TestColRef,
  TestDocRef,
  TestQueryRef,
} from '../testing/testing-adaptor';
import { Col } from './col';
import { ColResolver } from './col-resolver';
import { Doc } from './doc';
import { DocResolver } from './doc-resolver';
import { Query } from './query';
import { QueryResolver } from './query-resolver';

describe('DocResolver', () => {
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
    it('should create a DocResolver with the given adaptor and doc resolver function', () => {
      const resolver = DocResolver.create(adaptor, () => queryRef);
      expect(resolver).toBeInstanceOf(DocResolver);
    });
  });

  describe('resolve', () => {
    it('should resolve a document reference using resolve()', () => {
      const resolver = DocResolver.create(adaptor, () => docRef);
      const result = resolver.resolve(docRef);
      expect(result).toBeInstanceOf(Doc);
      expect(result.ref).toBe(docRef);
    });

    it('should allow calling the resolver directly', () => {
      const resolver = DocResolver.create(adaptor, () => docRef);
      const result = resolver(docRef);
      expect(result).toBeInstanceOf(Doc);
      expect(result.ref).toBe(docRef);
    });
  });

  describe('parent', () => {
    it('should create a parent resolver and resolve parent doc ref', () => {
      const parentRef = { id: 'parent', data: 'parent data' };
      // Mock adaptor.docParentRef to return parentRef
      adaptor.docParentRef = jest.fn().mockReturnValue(parentRef);

      const resolver = DocResolver.create(adaptor, () => docRef);
      const parentResolver = resolver.parent<typeof parentRef.data>();
      const result = parentResolver.resolve(docRef);

      expect(adaptor.docParentRef).toHaveBeenCalledWith(docRef);
      expect(result).toBeInstanceOf(Doc);
      expect(result.ref).toBe(parentRef);
    });
  });

  describe('col', () => {
    it('should create a ColResolver', () => {
      adaptor.colRef.mockReturnValue(colRef);

      const resolver = DocResolver.create(adaptor, () => docRef);
      const colResolver = resolver.col('posts');
      expect(colResolver).toBeInstanceOf(ColResolver);

      const col = colResolver.resolve(docRef);
      expect(col).toBeInstanceOf(Col);
      expect(col.ref).toBe(colRef);
    });
  });

  describe('query', () => {
    it('should create a QueryResolver', () => {
      const resolver = DocResolver.create(adaptor, () => docRef);
      const queryResolver = resolver.query(() => queryRef);
      expect(queryResolver).toBeInstanceOf(QueryResolver);

      const query = queryResolver.resolve(docRef);
      expect(query).toBeInstanceOf(Query);
      expect(query.ref).toBe(queryRef);
    });
  });
});
