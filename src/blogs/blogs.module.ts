import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { UsersModule } from 'src/users/users.module';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService],
  imports: [
    TypeOrmModule.forFeature([Blog, Category]),
    UsersModule,
  ],
})
export class BlogsModule {}
