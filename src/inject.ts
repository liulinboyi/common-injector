import 'reflect-metadata';
import { Injector, rootInjector } from './injector';

export type InjectOptions = {
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
export function Inject(injectOptions?: InjectOptions): (_constructor: any, propertyName: string) => any {
  return function (_constructor: any, propertyName: string): any {
    const  propertyType: any = injectOptions && injectOptions.provide ? injectOptions.provide : Reflect.getMetadata('design:type', _constructor, propertyName);
    const injector: Injector = injectOptions && injectOptions.injector ? injectOptions.injector : rootInjector;

    if (injector.getInstance(propertyType)) _constructor[propertyName] = injector.getInstance(propertyType);
    else if (injector.getProvider(propertyType)) {
      const providerClass = injector.getProvider(propertyType);
      if (!providerClass) throw Error(`injector can't find provider: ${(propertyType as any).name}`);
      const providerInsntance = new providerClass();
      injector.setInstance(propertyType, providerInsntance);
      _constructor[propertyName] = providerInsntance;
    } else throw Error(`injector can't find provider: ${(propertyType as any).name}`);

    return (_constructor as any)[propertyName];
  };
}
