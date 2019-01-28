import { rootInjector, Injector } from './injector';

/**
 * Decorator @Injectable
 * 
 * to decorate an Service
 * defalut injector is rootInjector
 * if argument has injector, will use other injector
 *
 * @export
 * @param {Injector} [injector]
 * @returns {(_constructor: any) => any}
 */
export function Injectable(injector?: Injector): (_constructor: any) => any {
  return function (_constructor: any): any {
      if (injector) injector.setProvider(_constructor, _constructor);
      if (!injector) rootInjector.setProvider(_constructor, _constructor);
      return _constructor;
  };
}
