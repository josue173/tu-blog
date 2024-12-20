import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [UsersModule, TypeOrmModule.forFeature([Comment, Blog, User])],
})
export class CommentsModule {}
