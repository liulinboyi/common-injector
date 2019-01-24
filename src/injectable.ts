import { rootInjector, Injector } from './injector';
import { Injected } from './injected';

/**
 * Decorator @Injectable
 * 
 * to decorate an Service
 * defalut injector is rootInjector
 * if argument has injector, will use other injector
 *
 * @param {Injector} [injector]
 * @returns {(_constructor: Function) => Function}
 */
export function Injectable(injector?: Injector): (_constructor: Function) => Function {
  return function (_constructor: Function): Function {
      Injected(_constructor);
      if (injector) injector.setProvider(_constructor, _constructor);
      if (!injector) rootInjector.setProvider(_constructor, _constructor);
      return _constructor;
  };
}
