import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Auth, GetUser } from 'src/users/decorators';
import { ValidRoles } from 'src/users/interfaces';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/commom/dto/pagination.dto';

@Controller('blogs')
@Auth()
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post('create')
  @Auth(ValidRoles.escritor)
  create(@Body() createBlogDto: CreateBlogDto, @GetUser() user: User) {
    createBlogDto.blog_owner = user.user_id;
    return this.blogsService.create(createBlogDto);
  }

  @Get('get-all')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.blogsService.findAll(paginationDto);
  }

  @Get('find-one')
  findByIdOrName(@Query('param') param: string) {
    return this.blogsService.findByIdOrName(param);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @GetUser() user: User,
  ) {
    return this.blogsService.update(id, updateBlogDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.blogsService.remove(id, user);
  }
}
