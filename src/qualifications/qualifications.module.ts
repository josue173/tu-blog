import { Module } from '@nestjs/common';
import { QualificationsService } from './qualifications.service';
import { QualificationsController } from './qualifications.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Qualification } from './entities/qualification.entity';
import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [QualificationsController],
  providers: [QualificationsService],
  imports: [UsersModule, TypeOrmModule.forFeature([Qualification, Blog, User])],
})
export class QualificationsModule {}
