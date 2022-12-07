import {
  DynamicModule,
  Global,
  Logger,
  Module,
  Provider,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { MONGODB_MODULE_OPTIONS } from './connects.constant';
import {
  MongooseModuleAsyncOptions,
  MongooseModuleOptionsFactory,
} from './types';

@Global()
@Module({})
export class MongooseConnectsModule {
  private static createAsyncProviders(
    options: MongooseModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: MongooseModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MONGODB_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: MONGODB_MODULE_OPTIONS,
      useFactory: async (optionsFactory: MongooseModuleOptionsFactory) =>
        optionsFactory.createMongooseOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }

  static forRootAsync(options: MongooseModuleAsyncOptions): DynamicModule {
    return {
      module: MongooseConnectsModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        ...(options.extraProviders || []),
      ],
    };
  }
}
