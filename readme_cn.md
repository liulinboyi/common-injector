# common-injector

深受Angular及其依赖注入实现的影响。 

受 [Angular](https://github.com/angular/angular) 和 [Indiv](https://github.com/DimaLiLongJi/InDiv) 的启发。

一个轻量的JavaScript和Node.js控制反转容器。


## 使用

1. 安装

  `npm install --save common-injector`


2. 配置

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


3. 使用 `@Injectable` 来声明依赖

  使用装饰器 `@Injectable` 去声明一个依赖。并且所有的依赖将在它的注入器中成为一个单例。

  ```typescript
  type InjectOptions = {
    provide?: any;
    injector?: Injector;
  };
  function Injectable(injectOptions?: InjectOptions): (_constructor: Function) => any;
  ```

  `@Injectable` 把一个依赖放入一个默认作为IOC容器的注入器 `rootInjector`。

  `@Injectable` 会在IOC容器内用类自身当做一个默认token。
  
  `@Injectable` 接收一个参数 `injectOptions: { provide?: any; injector?: Injector; }`。

  你可以通过 `injectOptions.injector` 用一个继承 `Injector` 的实例来创建其他的容器， 或是通过 `injectOptions.provide` 来为这个可注入的类设置一个注入器token。

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

  现在 `TestService` 已经在我们默认的注入器之中了，并且应该用 `TestServiceToken` 在IOC容器内作为token使用。
  
  我们可以把它当做一个依赖来使用。并且需要用 `TestServiceToken` 作为token标记这个依赖。

  因为使用懒汉模式实例化依赖，所以请注意依赖之间的顺序。


4. 使用 `@Inject` 把依赖注入到类之中

  使用解释器 `@Inject` 来把一个依赖注射为类的一个属性。

  ```typescript
  type InjectOptions = {
    provide?: any;
    injector?: Injector;
  };
  function Inject(injectOptions?: InjectOptions): (_constructor: any, propertyName: string) => any;
  ```

  `@Inject` 将从默认的注入器 `rootInjector` 获取一个依赖。

  `@Inject` 接收一个参数 `InjectOptions`，所有你可以通过 `injectOptions.injector` 来选择依赖来自哪个注入器，并可以通过 `injectOptions.provide` 来代替属性的类型去重设一个依赖，或是在 `javascript` 使用 `injectOptions.provide` 来声明哪个依赖需要被注入。


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

  因为 `@Inject` 会把值设置为对象的 `__proto__` 上，所以我们不可以改变被注入过的属性的值。


5. 创建其他的 `Injector` 作为容器

  - `new Injector()`

  我们可以使用其他 `Injector` 作为容器，并且实例也仅仅会在它注入器中成为一个单例。 **单例仅仅在这个注入器中成为单例**

  例如，我们创建一个注入器 `otherInjector` 作为容器，并把 `TestService2` 放到这个容器内成为一个单例。

  ```typescript
  import { Injectable, Inject, Injector } from 'common-injector';

  const otherInjector = new Injector();

  @Injectable(otherInjector)
  class TestService2 {
    public num: number = 3;
  }
  ```

  如果你想从其他的 `Injector` 注入器中注入一些实例的话，应该使用 `injectOptions.injector` 来声明被注入的实例来自哪些 `Injector` 注入器。

  ```typescript
  class App {
    @Inject() private testService: TestServiceToken;
    @Inject({injector: otherInjector}) private testService2: TestService2;
  }
  ```

  - `injector.fork()`

  **v0.0.3**新增

  我们可以使用 `Injector` 实例上的公开方法 `fork:() => Injector` 去创建一个子容器。

  ```typescript
  import { rootInjector } from 'common-injector';

  const otherInjector = rootInjector.fork();
  ```

  当请求一个依赖时，`injector` 注入器尝试去用它自己的注射器去满足该依赖。

  如果该注入器没有找到对应的提供商，它就把这个申请转给它父注入器来处理。

  如果那个注入器也无法满足这个申请，它就继续转给它在注入器树中的父注入器。
  
  这个申请继续往上冒泡 —— 直到找到一个能处理此申请的注入器或者找不到为止。

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


6. 在注入器中设置一个常量

  除了 `@Injectable` 之外，用过 `Injector` 实例的方法 `setInstance` 也可以直接往注入器之中放置一个常量。

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


7. 在 javascript 中使用

  因为使用 `Reflect.getMetadata('design:type')` 来获取属性的类型，但我们使用 `javascript` 时，这个API将失效。

  因此在 `javascript` 中，使用 `injectOptions.provide` 来声明需要被注入的依赖。

  ```javascript
  class App {
    @Inject({provide: TestServiceToken}) testService;
    @Inject({injector: otherInjector, provide: TestService2}) testService2;
  }
  ```
