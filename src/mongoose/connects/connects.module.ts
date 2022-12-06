import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { DatabaseConfigs } from './types';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class MongooseConnectsModule {
  protected static connects: Record<string, any>[];

  constructor(private readonly configService: ConfigService) {
    console.log('Started', this.configService.get('database'));
    MongooseConnectsModule.connects = this.configService.get('database');
  }

  static async delay(ms: number) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  static async getConnects(): Promise<Record<string, any>[]> {
    if (!MongooseConnectsModule.connects) {
      await this.delay(500);

      Logger.log('[MongooseConnects] Retry load configs');
      return this.getConnects();
    }

    console.log(MongooseConnectsModule.connects, 'TEST MODULE 1');
    return MongooseConnectsModule.connects;
  }

  static async forRootAsync(): Promise<DynamicModule> {
    const connects = this.getConnects();
    const imports = [];
    // console.log(connects, 'TEST MODULE 2');

    /**
     * Quy định tối đa chỉ được 50 connection
     * Các connection từ 50 trở đi sẽ không được khởi tạo
     */
    // maxConnects.forEach((_, index) => {
    //   imports.push({
    //     useModule: (configService: ConfigService) => {
    //       const mongooses = configService.get('database.mongoose');
    //       const { connectionName, uri } = mongooses[index] || {};
    //       if (!connectionName || !uri) return null;

    //       Logger.log('[Nest-mongoose] Connected ' + connectionName);
    //       return MongooseModule.forRoot(connectionName, uri);
    //     },
    //     inject: [ConfigService],
    //   });
    // });

    return {
      module: MongooseConnectsModule,
      imports: imports,
    };
  }
}
