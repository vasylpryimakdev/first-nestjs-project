import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly dummyService: DummyService,
    private readonly logger: LoggerService,
  ) {}

  getHello(): string {
    return this.logger.log('Hello World');
  }
}
