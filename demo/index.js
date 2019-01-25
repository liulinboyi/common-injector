import { Inject, Injectable, Injector } from 'common-injector';

@Injectable()
class TestService3 {
  
}
@Injectable()
class TestService2 {
  @Inject({provide: TestService3}) aaa;
}

const otherInjector = new Injector();

@Injectable(otherInjector)
class TestService5 {
  
}

@Injectable(otherInjector)
class TestService4 {
  @Inject({injector: otherInjector, provide: TestService5}) aaa;
}

class TestService {
  @Inject({provide: TestService2}) aaa;
  @Inject({injector: otherInjector, provide: TestService4}) aaa2;
}

const aaa = new TestService();
console.log(55555555, aaa);
