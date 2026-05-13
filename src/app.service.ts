import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/config.types';
import { AppConfig } from './config/app.config';

@Injectable()
export class AppService {
  constructor(
    private readonly dummyService: DummyService,
    private readonly logger: LoggerService,
    private readonly configServie: ConfigService<ConfigType>,
  ) {}

  getHello(): string {
    const prefix = this.configServie.get<AppConfig>('app')?.messagePrefix;

    return this.logger.log(`${prefix} Hello World`);
  }
}
