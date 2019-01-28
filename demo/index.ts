import { Inject, Injectable, Injector } from 'common-injector';

@Injectable()
class TestService3 {
}

@Injectable()
class TestService2 {
  @Inject() public aaa: TestService3;
}

const otherInjector = new Injector();

class AA {
  public aaa: string;
}
otherInjector.setInstance(AA, {aaa: '123'});

@Injectable(otherInjector)
class TestService5 {
  
}

@Injectable(otherInjector)
class TestService4 {
  @Inject({injector: otherInjector}) public aaa: TestService5;
}

class TestService {
  @Inject() public aaa: TestService2;
  @Inject({injector: otherInjector}) public aaa2: TestService4;
  @Inject() public aaab: AA;
}

const aaa = new TestService();
console.log(55555555, aaa);
