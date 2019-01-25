# common-injector

深受Angular及其依赖注入实现的影响。 受Angular和Indiv的启发。

Heavily influenced by Angular and it's dependency injection. Inspired by Angular and Indiv.

一个轻量的JavaScript和Node.js控制反转容器。

A lightweight inversion of control container for JavaScript & Node.js apps.


## Usage

1. Install

  `npm install --save common-injector`


2. Config

  If you are using `typescript`, common-injector requires TypeScript >= 2.0 and the experimentalDecorators, emitDecoratorMetadata, types and lib compilation options in your tsconfig.json file.

  ```javascript
  {
      "compilerOptions": {
          "target": "es5",
          "module": "commonjs",
          "moduleResolution": "node",
          "experimentalDecorators": true,
          "emitDecoratorMetadata": true
      }
  }
  ```

  If you are using `javascript`, common-injector requires `@babel/plugin-proposal-decorators` and `@babel/plugin-proposal-class-properties` to support `decorators` in `javascript`.

  ```javascript
  {
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env',
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        'dynamic-import-webpack',
      ],
    },
  }
  ```


3. Declare dependencies by using the `@Injectable`

  Use decorator `@Injectable` to declare a dependency. And this dependency will be a singleton instance in it's injector.

  ```typescript
  function Injectable(injector?: Injector): (_constructor: Function) => void;
  ```

  `@Injectable` will put a dependency in a defalut injector `rootInjector` as IOC container.

  `@Injectable` accepts a parameter `Injector`, and you can create other container by instantiating a class `Injector`.

  ```typescript
  import { Injectable } from 'common-injector';

  @Injectable()
  class TestService {
    public num: number = 3;
  }
  ```

  Now `TestService` is in our default injector, we can use it as a dependency.


4. Inject dependencies into a class by using the `@Inject`

  Use decorator `@Inject` to inject a dependency as property of a class.

  ```typescript
  type InjectOptions = {
    provide?: any;
    injector?: Injector;
  };
  function Inject(injectOptions?: InjectOptions): (_constructor: any, propertyName: string) => void;
  ```

  `@Inject` will get a dependency from a defalut injector `rootInjector`.

  `@Inject` accepts a parameter `InjectOptions`, so you can choose this dependency from which injector with `injectOptions.injector` and use `injectOptions.provide` to reset a dependency instead of type of property or use `injectOptions.provide` to declare a dependency in `javascript`.


  ```typescript
  import { Injectable, Inject } from 'common-injector';

  @Injectable()
  class TestService {
    public num: number = 3;
  }

  class App {
    @Inject() private testService: TestService;
  }
  ```

  Because `@Inject` will set value in `__proto__` of Object, so should not change value of the injected property.


5. Create another `Injector` as container

  We can use another `Injector` as container, and an instance will be a singleton only in it's injector.

   For example, we will creat a injector `otherInjector` as container and `TestService2` will be put in `otherInjector` as a a singleton instance.

  ```typescript
  import { Injectable, Inject, Injector } from 'common-injector';

  const otherInjector = new Injector();

  @Injectable(otherInjector)
  class TestService2 {
    public num: number = 3;
  }
  ```

  If want to inject instance from other `Injector`, should use `injectOptions.injector` to declare this instance will be injected from other `Injector`.

  ```typescript
  class App {
    @Inject() private testService: TestService;
    @Inject({injector: otherInjector}) private testService2: TestService2;
  }
  ```


6. Used in javascript

  Because of using `Reflect.getMetadata('design:type')` to get the type of property, when we use javascript, `Reflect.getMetadata('design:type')` will be disable.

  So in javascript, `injectOptions.provide` can be used to declare which provide of dependency will be injected.

  ```javascript
  class App {
    @Inject({provide: TestService}) testService;
    @Inject({injector: otherInjector, provide: TestService2}) testService2;
  }
  ```
