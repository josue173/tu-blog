import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommomModule } from './commom/commom.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { LikesModule } from './likes/likes.module';
import { User } from './users/entities/user.entity';
import { Blog } from './blogs/entities/blog.entity';
import { Like } from './likes/entities/like.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      entities: [User, Blog, Like],
      autoLoadEntities: true,
      synchronize: true, // solo para desarrollo
    }),
    CommomModule,
    CategoriesModule,
    UsersModule,
    BlogsModule,
    LikesModule,
  ],
})
export class AppModule {}
