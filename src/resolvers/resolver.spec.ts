import { MakeResolver } from './resolver';

describe('MakeResolver', () => {
  it('should call the .call method when invoked as a function', () => {
    class AddOne {
      resolve(arg: number): number {
        return arg + 1;
      }
    }
    const addOne = new AddOne();
    const callable = MakeResolver<AddOne, number, number>(
      addOne,
      addOne.resolve
    );
    expect(callable(2)).toBe(3);
    expect(callable.resolve(5)).toBe(6);
  });

  it('should preserve properties and methods of the original object', () => {
    class WithProp {
      prop = 'hello';
      resolve(arg: string) {
        return this.prop + arg;
      }
    }
    const withProp = new WithProp();
    const callable = MakeResolver<WithProp, string, string>(
      withProp,
      withProp.resolve
    );

    expect(callable(' world')).toBe('hello world');
    expect(callable.prop).toBe('hello');
  });

  it('should bind "this" correctly when calling .call', () => {
    class WithThis {
      factor = 10;
      resolve(arg: number) {
        return arg * this.factor;
      }
    }
    const withThis = new WithThis();
    const callable = MakeResolver<WithThis, number, number>(
      withThis,
      withThis.resolve
    );

    expect(callable(2)).toBe(20);
  });

  it('should forward arguments to .call', () => {
    class Echo {
      resolve(arg: string) {
        return arg;
      }
    }
    const echo = new Echo();
    const callable = MakeResolver<Echo, string, string>(echo, echo.resolve);
    expect(callable('test')).toBe('test');
  });

  it('should work with different argument and return types', () => {
    class BoolToString {
      resolve(arg: boolean) {
        return arg ? 'yes' : 'no';
      }
    }
    const boolToString = new BoolToString();
    const callable = MakeResolver<BoolToString, boolean, string>(
      boolToString,
      boolToString.resolve
    );
    expect(callable(true)).toBe('yes');
    expect(callable(false)).toBe('no');
  });

  it('should set the prototype to that of the original object', () => {
    class CustomProto {
      resolve(arg: number) {
        return arg * 2;
      }
      customMethod() {
        return 'custom';
      }
    }
    const instance = new CustomProto();
    const callable = MakeResolver<CustomProto, number, number>(
      instance,
      instance.resolve
    );

    expect(callable).toBeInstanceOf(CustomProto);
    expect(Object.getPrototypeOf(callable)).toBe(CustomProto.prototype);
  });
});
