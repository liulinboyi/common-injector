import { Inject, Injectable, Injector } from 'common-injector';

@Injectable()
class TestService3 {
  
}
@Injectable()
class TestService2 {
  @Inject({provide: TestService3}) aaa;
}

const otherInjector = new Injector();

class AA {}
otherInjector.setInstance(AA, {aaa: '123'});

class TestService5Type {}
@Injectable({injector: otherInjector, provide: TestService5Type})
class TestService5 {
  
}

@Injectable({injector: otherInjector})
class TestService4 {
  @Inject({injector: otherInjector, provide: TestService5Type}) aaa;
}

class TestService {
  @Inject({provide: TestService2}) aaa;
  @Inject({injector: otherInjector, provide: TestService4}) aaa2;
  @Inject({injector: otherInjector, provide: AA}) aaab;
}

const aaa = new TestService();
console.log(55555555, aaa);
