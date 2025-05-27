import { Doc } from './accessors/doc';
import { DocResolver } from './resolvers/doc-resolver';
import { NewResource } from './resource';
import {
  TestAdaptor,
  TestAdaptorTypes,
  TestDocRef,
} from './testing/testing-adaptor';

interface IUser {
  id: string;
  name: string;
}

describe('NewResource', () => {
  type T = string;
  let adaptor: TestAdaptor;
  let docRef: TestDocRef<T>;

  beforeEach(() => {
    adaptor = new TestAdaptor();
    docRef = { id: '1', data: 'hello world' };
  });

  it('should create a Resource instance', () => {
    const resource = NewResource<TestAdaptorTypes, IUser>(adaptor);
    expect(resource).toBeInstanceOf(DocResolver);
  });

  it('should pass the adaptor to the parent DocResolver', () => {
    const resource = NewResource<TestAdaptorTypes, IUser>(adaptor);
    const result = resource.parent().resolve(docRef);
    expect(result).toBeInstanceOf(Doc);
    expect(adaptor.docParentRef).toHaveBeenCalledWith(docRef);
  });
});
