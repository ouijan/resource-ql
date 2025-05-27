import * as bundle from './index';

describe('index', () => {
  it('should export all necessary modules', () => {
    expect(bundle.NewResource).toBeDefined();
  });
});
