import { MongooseModuleOptions } from '@nestjs/mongoose';

export type MongooseConfigs = {
  connectionName: string;
  uri: string;
  options: MongooseModuleOptions;
};

export type DatabaseConfigs = {
  mongoose: MongooseConfigs[];
};
