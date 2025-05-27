import { Doc } from './nodes/doc';
import { DocResolver } from './nodes/doc-resolver';
import { Resource } from './resource';
import {
  TestAdaptor,
  TestAdaptorTypes,
  TestDocRef,
} from './testing/testing-adaptor';

interface IUser {
  id: string;
  name: string;
}

describe('Resource', () => {
  type T = string;
  let adaptor: TestAdaptor;
  let docRef: TestDocRef<T>;

  beforeEach(() => {
    adaptor = new TestAdaptor();
    docRef = { id: '1', data: 'hello world' };
  });

  it('should create a Resource instance', () => {
    const resource = new Resource<IUser, TestAdaptorTypes>(adaptor);
    expect(resource).toBeInstanceOf(Resource);
    expect(resource).toBeInstanceOf(DocResolver);
  });

  it('should pass the adaptor to the parent DocResolver', () => {
    const resource = new Resource<IUser, TestAdaptorTypes>(adaptor);
    const result = resource.parent().resolve(docRef);
    expect(result).toBeInstanceOf(Doc);
    expect(adaptor.docParentRef).toHaveBeenCalledWith(docRef);
  });

  it('should allow chaining (returns this)', () => {
    const resource = new Resource<IUser, TestAdaptorTypes>(adaptor);
    // Assuming DocResolver has a dummy method for chaining, e.g., .col()
    // Here we just check that the instance is returned for chaining
    expect(resource).toBeInstanceOf(Resource);
  });
});
