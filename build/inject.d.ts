import 'reflect-metadata';
import { Injector } from './injector';
export declare type InjectOptions = {
    provide?: any;
    injector?: Injector;
};
/**
 * For declearation dependence in Class
 *
 * @export
 * @param {InjectOptions} [injectOptions]
 * @returns {(_constructor: any, propertyName: string) => any}
 */
export declare function Inject(injectOptions?: InjectOptions): (_constructor: any, propertyName: string) => any;
