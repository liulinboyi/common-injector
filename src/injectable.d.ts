import { Injector } from './injector';
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
export declare function Injectable(injector?: Injector): (_constructor: any) => any;
