import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';
import { BlogsModule } from 'src/blogs/blogs.module';
import { User } from 'src/users/entities/user.entity';
import { Blog } from 'src/blogs/entities/blog.entity';
import { Like } from './entities/like.entity';

@Module({
  controllers: [LikesController],
  imports: [TypeOrmModule.forFeature([Like, User, Blog]), UsersModule, BlogsModule],
  providers: [LikesService],
})
export class LikesModule {}
