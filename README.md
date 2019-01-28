# common-injector

深受Angular及其依赖注入实现的影响。 受Angular和Indiv的启发。

Heavily influenced by Angular and it's dependency injection. Inspired by Angular and Indiv.

一个轻量的JavaScript和Node.js控制反转容器。

A lightweight inversion of control container for JavaScript & Node.js apps.


## Usage

1. Install 安装

  `npm install --save common-injector`


2. Config 配置

  If you are using `typescript`, `common-injector` requires `TypeScript` >= 2.0 and the experimentalDecorators, emitDecoratorMetadata, types and lib compilation options in your tsconfig.json file.

  如果您正在使用 `typescript`，`common-injector` 需要 `TypeScript` >= 2.0，并且在你的 `tsconfig.json` 中需要开启 `experimentalDecorators, emitDecoratorMetadata, types, lib compilation` 等选项。

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

  如果您正在使用 `javascript` 和 `webpack`，`common-injector` 需要  `@babel/plugin-proposal-decorators` 和 `@babel/plugin-proposal-class-properties` 去支持 `javascript` 中的解释器这一功能。

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


3. Declare dependencies by using the `@Injectable`  使用 `@Injectable` 来声明依赖

  Use decorator `@Injectable` to declare a dependency. And all dependencies will be a singleton instance in it's injector.

  使用解释器 `@Injectable` 去声明一个依赖。并且所有的依赖将在它的注入器中成为一个单例。

  ```typescript
  function Injectable(injector?: Injector): (_constructor: Function) => void;
  ```

  `@Injectable` will put a dependency in a defalut injector `rootInjector` as IOC container.

  `@Injectable` 把一个依赖放入一个默认作为IOC容器的注入器 `rootInjector`。

  `@Injectable` accepts a parameter `Injector`, and you can create other container by instantiating a class `Injector`.

  `@Injectable` 接收一个参数 `Injector`，你也可以通过实例化一个类 `Injector` 来创建其他的容器。

  ```typescript
  import { Injectable } from 'common-injector';

  @Injectable()
  class TestService {
    public num: number = 3;
  }
  ```

  Now `TestService` has been in our default injector, we can use it as a dependency.

  现在 `TestService` 已经在我们默认的注入器之中了，我们可以把它当做一个依赖来使用。

  Because of using lazy initialization to initialize dependency, please pay attention to the **order** of dependency.

  因为使用懒汉模式实例化依赖，所以请注意依赖之间的顺序。


4. Inject dependencies into a class by using the `@Inject`  使用 `@Inject` 把依赖注入到类之中

  Use decorator `@Inject` to inject a dependency as property of a class.

  使用解释器 `@Inject` 来把一个依赖注射为类的一个属性。

  ```typescript
  type InjectOptions = {
    provide?: any;
    injector?: Injector;
  };
  function Inject(injectOptions?: InjectOptions): (_constructor: any, propertyName: string) => void;
  ```

  `@Inject` will get a dependency from a defalut injector `rootInjector`.

  `@Inject` 将从默认的注入器 `rootInjector` 获取一个依赖。

  `@Inject` accepts a parameter `InjectOptions`, so you can choose this dependency from which injector with `injectOptions.injector` and use `injectOptions.provide` to reset a dependency instead of type of property or use `injectOptions.provide` to declare which dependency need to be injected in `javascript`.

  `@Inject` 接收一个参数 `InjectOptions`，所有你可以通过 `injectOptions.injector` 来选择依赖来自哪个注入器，并可以通过 `injectOptions.provide` 来代替属性的类型去重设一个依赖，或是在 `javascript` 使用 `injectOptions.provide` 来声明哪个依赖需要被注入。


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

  Because `@Inject` will set value in `__proto__` of Object, so we should not change value of the injected property.

  因为 `@Inject` 会把值设置为对象的 `__proto__` 上，所以我们不可以改变被注入过的属性的值。


5. Create another `Injector` as container  创建其他的 `Injector` 作为容器

  We can use another `Injector` as container, and an instance will be a singleton only in it's injector. **singleton singleton will be only in this `Injector`**

  我们可以使用其他 `Injector` 作为容器，并且实例也仅仅会在它注入器中成为一个单例。 **单例仅仅在这个注入器中成为单例**

   For example, we will creat a injector `otherInjector` as container and `TestService2` will be put in `otherInjector` as a a singleton instance.

   例如，我们创建一个注入器 `otherInjector` 作为容器，并把 `TestService2` 放到这个容器内成为一个单例。

  ```typescript
  import { Injectable, Inject, Injector } from 'common-injector';

  const otherInjector = new Injector();

  @Injectable(otherInjector)
  class TestService2 {
    public num: number = 3;
  }
  ```

  If you want to inject some instances from other `Injector`, should use `injectOptions.injector` to declare this instance will be injected from other `Injector`.

  如果你想从其他的 `Injector` 注入器中注入一些实例的话，应该使用 `injectOptions.injector` 来声明被注入的实例来自哪些 `Injector` 注入器。

  ```typescript
  class App {
    @Inject() private testService: TestService;
    @Inject({injector: otherInjector}) private testService2: TestService2;
  }
  ```


6. Set a constanst in `Injector`  在注入器中设置一个常量

  In addition to `@Injectable`,  with the method `setValue` from instance of `Injector`, we can also insert a constant into `Injector` directly。

  除了 `@Injectable` 之外，用过 `Injector` 实例的方法 `setValue` 也可以直接往注入器之中插入一个常量。

  ```typescript
  const otherInjector = new Injector();
  class ConstantValue {
    public aaa: number;
  }
  otherInjector.setValue(ConstantValue, {aaa: 123});
  ```

  ```typescript
  class App {
    @Inject() private testService: TestService;
    @Inject({injector: otherInjector}) private testService2: TestService2;
    @Inject({injector: otherInjector}) private constantValue: ConstantValue;
  }
  ```

7. Used in javascript  在 javascript 中使用

  Because of using `Reflect.getMetadata('design:type')` to get the type of property, when we use `javascript`, this API will be disable.

  因为使用 `Reflect.getMetadata('design:type')` 来获取属性的类型，但我们使用 `javascript` 时，这个API将失效。

  So in javascript, `injectOptions.provide` can be used to declare which provide of dependency will be injected.

  因此在 `javascript` 中，使用 `injectOptions.provide` 来声明需要被注入的依赖。

  ```javascript
  class App {
    @Inject({provide: TestService}) testService;
    @Inject({injector: otherInjector, provide: TestService2}) testService2;
  }
  ```
