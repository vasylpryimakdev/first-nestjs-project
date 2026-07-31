import * as request from 'supertest';
import { TestSetup } from './utils/test-setup';
import { AppModule } from 'src/app.module';

describe('AppController (e2e)', () => {
  let testSetup: TestSetup;

  beforeEach(async (): Promise<void> => {
    testSetup = await TestSetup.create(AppModule);
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  it('/ (GET)', () => {
    return request(testSetup.app.getHttpServer())
      .get('/')
      .expect(300)
      .expect((res) => expect(res.text).toContain('Hello World'));
  });
});
