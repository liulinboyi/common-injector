import 'reflect-metadata';

/**
 * For declear dependence in Class
 *
 * @export
 * @param {any} [dependence]
 * @returns
 */
export function Inject(dependence?: any): Function {
  return function (_constructor: any, propertyName: string) {
    // TODO 获取 属性
    const paramsTypes: Function[] = Reflect.getMetadata('design:paramtypes', _constructor);
    if (paramsTypes && paramsTypes.length) {
      paramsTypes.forEach(v => {
        if (v === _constructor) {
          throw new Error('不可以依赖自身');
        } else {
          if ((_constructor as any)._needInjectedClass) {
            (_constructor as any)._needInjectedClass.push(v);
          } else {
            (_constructor as any)._needInjectedClass = [v];
          }
        }
      });
    }
  };
}
