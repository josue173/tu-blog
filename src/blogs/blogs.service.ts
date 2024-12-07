import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsService {
  private readonly logger = new Logger('BlogsService');
  constructor(
    @InjectRepository(Blog)
    private readonly _blogRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    try {
      const blog = this._blogRepository.create(createBlogDto);
      await this._blogRepository.save(blog);
      return blog;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all blogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }

  private handleExceptions(error: any) {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
