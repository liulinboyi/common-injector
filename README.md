# common-injector

Heavily influenced by Angular and it's dependency injection. 

Inspired by [Angular](https://github.com/angular/angular) and [Indiv](https://github.com/DimaLiLongJi/InDiv).

A lightweight inversion of control container for JavaScript & Node.js apps.

[中文](readme_cn.md)

## Usage

1. Install

  `npm install --save common-injector`


2. Config

  If you are using `typescript`, `common-injector` requires `TypeScript` >= 2.0 and the experimentalDecorators, emitDecoratorMetadata, types and lib compilation options in your tsconfig.json file.

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

  If you are using `javascript` and `webpack`, `common-injector` requires `@babel/plugin-proposal-decorators` and `@babel/plugin-proposal-class-properties` to support `decorators` in `javascript`.

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

  Use decorator `@Injectable` to declare a dependency. And all dependencies will be a singleton instance in it's injector.

  ```typescript
  type InjectOptions = {
    provide?: any;
    injector?: Injector;
  };
  function Injectable(injectOptions?: InjectOptions): (_constructor: Function) => any;
  ```

  `@Injectable` will put a dependency into a defalut injector `rootInjector` as IOC container.

  `@Injectable` will use the class itself as a default token in the IOC container.

  `@Injectable` accepts a parameter `injectOptions: { provide?: any; injector?: Injector; }`.
  
  You can create other container with an instance which extends `Injector` by `injectOptions.injector`, or set an injection token for this injectable provider by `injectOptions.provide`.

  ```typescript
  import { Injectable } from 'common-injector';

  class TestServiceToken {
    public num: number;
  }

  @Injectable({ provide: TestServiceToken })
  class TestService {
    public num: number = 3;
  }
  ```

  Now `TestService` has been in our default injector, and we should use `TestServiceToken` as a token in the IOC container。
  
  we can use it as a dependency，and need to use `TestServiceToken` as a token to mark this dependency.

  Because of using lazy initialization to initialize dependency, please pay attention to the **order** of dependency.


4. Inject dependencies into a class by using the `@Inject`

  Use decorator `@Inject` to inject a dependency as property of a class.

  ```typescript
  type InjectOptions = {
    provide?: any;
    injector?: Injector;
  };
  function Inject(injectOptions?: InjectOptions): (_constructor: any, propertyName: string) => any;
  ```

  `@Inject` will get a dependency from a defalut injector `rootInjector`.

  `@Inject` accepts a parameter `InjectOptions`, so you can choose this dependency from which injector with `injectOptions.injector` and use `injectOptions.provide` to reset a dependency instead of type of property or use `injectOptions.provide` to declare which dependency need to be injected in `javascript`.


  ```typescript
  import { Injectable, Inject } from 'common-injector';

  class TestServiceToken {
    public num: number;
  }

  @Injectable({ provide: TestServiceToken })
  class TestService {
    public num: number = 3;
  }

  class App {
    @Inject() private testService: TestServiceToken;
  }
  ```

  Because `@Inject` will set value in `__proto__` of Object, so we should not change value of the injected property.


5. Create another `Injector` as container

  - `new Injector()`

  We can use another `Injector` as container, and an instance will be a singleton only in it's injector. **singleton singleton will be only in this `Injector`**

  For example, we will creat a injector `otherInjector` as container and `TestService2` will be put in `otherInjector` as a a singleton instance.

  ```typescript
  import { Injectable, Inject, Injector } from 'common-injector';

  const otherInjector = new Injector();

  @Injectable(otherInjector)
  class TestService2 {
    public num: number = 3;
  }
  ```

  If you want to inject some instances from other `Injector`, should use `injectOptions.injector` to declare this instance will be injected from other `Injector`.

  ```typescript
  class App {
    @Inject() private testService: TestServiceToken;
    @Inject({injector: otherInjector}) private testService2: TestService2;
  }
  ```

  - `injector.fork()`

  **v0.0.3**

  We can use public method `fork:() => Injector` of `Injector`'s instance to create a child container.

  ```typescript
  import { rootInjector } from 'common-injector';

  const otherInjector = rootInjector.fork();
  ```

  When request a dependency, `injector` tries to satisfy that dependency with a provider registered in his own `injector`.

  If this `injector` lacks the `provider`, it passes the request up to its parent's `injector`. 
  
  If that `injector` can't satisfy the request, it passes the request along to the next parent `injector` up the tree. 
    
  The request of dependency keeps bubbling up until other `injector` finds or not find.

  ```typescript
  import { rootInjector } from 'common-injector';

  @Injectable()
  class TestServiceToken {
    public num: number = 3;
  }

  const childInjector = rootInjector.fork();

  class App {
    @Inject({injector: childInjector}) private testService: TestServiceToken;
  }
  ```


6. Set a constanst in `Injector`

  In addition to `@Injectable`,  with the method `setInstance` from instance of `Injector`, we can also insert a constant into `Injector` directly。

  ```typescript
  const otherInjector = new Injector();
  class ConstantValue {
    public aaa: number;
  }
  otherInjector.setInstance(ConstantValue, {aaa: 123});
  ```

  ```typescript
  class App {
    @Inject() private testService: TestServiceToken;
    @Inject({injector: otherInjector}) private testService2: TestService2;
    @Inject({injector: otherInjector}) private constantValue: ConstantValue;
  }
  ```


7. Used in javascript

  Because of using `Reflect.getMetadata('design:type')` to get the type of property, when we use `javascript`, this API will be disable.

  So in javascript, `injectOptions.provide` can be used to declare which provide of dependency will be injected.

  ```javascript
  class App {
    @Inject({provide: TestServiceToken}) testService;
    @Inject({injector: otherInjector, provide: TestService2}) testService2;
  }
  ```
