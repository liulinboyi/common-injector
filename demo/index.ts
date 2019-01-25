import { Inject, Injectable, Injector } from 'common-injector';

@Injectable()
class TestService3 {
}
@Injectable()
class TestService2 {
  @Inject() public aaa: TestService3;
}

const otherInjector = new Injector();

@Injectable(otherInjector)
class TestService5 {
  
}

@Injectable(otherInjector)
class TestService4 {
  @Inject() public aaa: TestService5;
}

class TestService {
  @Inject() public aaa: TestService2;
  @Inject({injector: otherInjector}) public aaa2: TestService4;
}

const aaa = new TestService();
console.log(55555555, aaa.aaa2);
