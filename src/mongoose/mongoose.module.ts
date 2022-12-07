import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Module({})
export class MongooseCoreModule {
  /**
   * Phục vụ những người không dùng với nest-core
   * Lưu ý: Nếu dùng với nest-core thì không dùng hàm này
   * @param options
   * @returns
   */
  static forRoot(uri: string, options?: MongooseModuleOptions): DynamicModule {
    return {
      module: MongooseCoreModule,
      imports: [MongooseModule.forRoot(uri, options)],
    };
  }

  /**
   * Phục vụ những người dùng với nest-core
   * Lưu ý: Nếu dùng với nest-core thì dùng hàm này
   * @param options
   * @returns
   */
  static forPlugin(): DynamicModule {
    const maxConnects = new Array(10).fill(false);
    const imports: DynamicModule[] = [];

    Logger.log('[NestMongoose] Connecting to database...');
    maxConnects.forEach((_, index) => {
      imports.push(
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            const connects = configService.get('database.mongoose') || [];
            const connect = connects[index];

            // Lưu lại các module hợp lệ
            if (connect) {
              const { connectionName, options, uri } = connect || {};
              Logger.log('[NestMongoose] Connected to ' + connectionName);
              return {
                ...options,
                connectionName,
                uri,
              };
            }

            return null;
          },
          inject: [ConfigService],
        }),
      );
    });

    Logger.log('[NestMongoose] Connected to all connections');

    return {
      module: MongooseCoreModule,
      imports: imports,
    };
  }
}
