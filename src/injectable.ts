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
 * @returns {(_constructor: Function) => void}
 */
export function Injectable(injector?: Injector): (_constructor: Function) => void {
  return function (_constructor: Function): void {
      if (injector) injector.setProvider(_constructor, _constructor);
      if (!injector) rootInjector.setProvider(_constructor, _constructor);
  };
}
