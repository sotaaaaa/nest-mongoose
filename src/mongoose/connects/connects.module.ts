import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { DatabaseConfigs } from './types';

@Global()
@Module({})
export class MongooseConnectsModule {
  static getConnects(configService: ConfigService) {
    const database = configService.get<DatabaseConfigs>('database');
    const { mongoose } = database || {};

    // Trường hợp không có connects nào vào mongoose
    if (mongoose.length) {
      Logger.log('[Nest-mongoose] The mongoose connection list was not found');
      return [];
    }

    const modules: DynamicModule[] = [];
    for (const connect of mongoose) {
      modules.push(
        MongooseModule.forRoot(connect.uri, {
          connectionName: connect.connectionName,
          ...connect.options,
        }),
      );

      const message = `[Nest-mongoose] Connected ${connect.connectionName} successfully`;
      Logger.log(message);
    }

    return modules;
  }

  static forRootAsync(): DynamicModule {
    const imports: DynamicModule[] = [];
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        imports.concat(this.getConnects(configService));
        Logger.log('[Nest-mongoose] Build connect successfully');
      },
    });

    return {
      module: MongooseConnectsModule,
      imports: imports,
    };
  }
}
