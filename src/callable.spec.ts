import { ICallable, MakeCallable } from './callable';

describe('MakeCallable', () => {
  it('should call the .call method when invoked as a function', () => {
    class AddOne implements ICallable<number, number> {
      call(arg: number): number {
        return arg + 1;
      }
    }

    const callable = MakeCallable<AddOne, number, number>(new AddOne());
    expect(callable(2)).toBe(3);
    expect(callable.call(5)).toBe(6);
  });

  it('should preserve properties and methods of the original object', () => {
    class WithProp implements ICallable<string, string> {
      prop = 'hello';
      call(arg: string) {
        return this.prop + arg;
      }
    }
    const callable = MakeCallable<WithProp, string, string>(new WithProp());

    expect(callable(' world')).toBe('hello world');
    expect(callable.prop).toBe('hello');
  });

  it('should bind "this" correctly when calling .call', () => {
    class WithThis implements ICallable<number, number> {
      factor = 10;
      call(arg: number) {
        return arg * this.factor;
      }
    }

    const callable = MakeCallable<WithThis, number, number>(new WithThis());

    expect(callable(2)).toBe(20);
  });

  it('should forward arguments to .call', () => {
    class Echo implements ICallable<string, string> {
      call(arg: string) {
        return arg;
      }
    }
    const callable = MakeCallable<Echo, string, string>(new Echo());
    expect(callable('test')).toBe('test');
  });

  it('should work with different argument and return types', () => {
    class BoolToString implements ICallable<boolean, string> {
      call(arg: boolean) {
        return arg ? 'yes' : 'no';
      }
    }
    const callable = MakeCallable<BoolToString, boolean, string>(
      new BoolToString()
    );
    expect(callable(true)).toBe('yes');
    expect(callable(false)).toBe('no');
  });

  it('should set the prototype to that of the original object', () => {
    class CustomProto implements ICallable<number, number> {
      call(arg: number) {
        return arg * 2;
      }
      customMethod() {
        return 'custom';
      }
    }
    const instance = new CustomProto();
    const callable = MakeCallable<CustomProto, number, number>(instance);

    expect(callable).toBeInstanceOf(CustomProto);
    expect(Object.getPrototypeOf(callable)).toBe(CustomProto.prototype);
  });
});
