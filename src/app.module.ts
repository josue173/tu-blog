import { Module } from '@nestjs/common';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommomModule } from './commom/commom.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    RolesModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, // solo para desarrollo
    }),
    CommomModule,
    CategoriesModule,
    UsersModule,
  ],
  controllers: [RolesController],
  providers: [],
})
export class AppModule {}
