import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Auth, GetUser } from 'src/users/decorators';
import { User } from 'src/users/entities/user.entity';

@Controller('likes')
@Auth()
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @GetUser() user: User) {
    return this.likesService.create(createLikeDto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLikeDto: UpdateLikeDto,
    @GetUser() user: User,
  ) {
    return this.likesService.update(id, updateLikeDto, user.user_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.likesService.remove(id, user);
  }
}
