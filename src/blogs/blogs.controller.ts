import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Auth, GetUser } from 'src/users/decorators';
import { ValidRoles } from 'src/users/interfaces';
import { User } from 'src/users/entities/user.entity';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}
  
  @Post('create')
  @Auth(ValidRoles.escritor)
  create(@Body() createBlogDto: CreateBlogDto, @GetUser() user: User) {
    createBlogDto.blog_owner = user.user_id;
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(+id);
  }
}
