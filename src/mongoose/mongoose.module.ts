import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongooseConnectsModule } from './connects';

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
    return {
      module: MongooseCoreModule,
      imports: [MongooseConnectsModule.forRootAsync()],
    };
  }
}
