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
  protected static configService: ConfigService;

  constructor(private readonly configService: ConfigService) {
    console.log('Started', this.configService.get('database'));
    MongooseConnectsModule.configService = this.configService;
  }

  static forRootAsync(): DynamicModule {
    // const maxConnects = new Array(50).fill(0);
    const imports = [];
    // console.log(this.configService.get('database'), 'TEST MODULE');

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
