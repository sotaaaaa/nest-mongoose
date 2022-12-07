import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export type MongooseConfigs = {
  connectionName: string;
  uri: string;
  options: MongooseModuleOptions;
};

export type DatabaseConfigs = {
  mongoose: MongooseConfigs[];
};

export interface MongooseModuleOptionsFactory {
  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions;
}

export interface MongooseModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<MongooseModuleOptionsFactory>;
  useClass?: Type<MongooseModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<MongooseModuleOptions> | MongooseModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
