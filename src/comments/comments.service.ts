import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Blog } from 'src/blogs/entities/blog.entity';
import { PaginationDto } from 'src/commom/dto/pagination.dto';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger('CommentsService');
  constructor(
    @InjectRepository(Comment)
    private readonly _commentRepository: Repository<Comment>,
    @InjectRepository(Blog)
    private readonly _blogRepository: Repository<Blog>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User) {
    try {
      const { comm_blog, comm_text } = createCommentDto;
      const blogExists = await this._blogRepository.findOneBy({
        blog_id: comm_blog,
      });
      if (!blogExists) throw new Error('Blog not found');
      const comment: Comment = this._commentRepository.create({
        comm_text,
        comm_blog: blogExists,
        comm_owner: user,
      });
      return await this._commentRepository.save(comment);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const comments = await this._commentRepository.find({
        relations: ['comm_owner', 'comm_blog'], // Cargar las relaciones necesarias
        take: limit,
        skip: offset,
      });
      return comments;
    } catch (error) {
      throw new Error(`Failed to retrieve comments: ${error.message}`);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }

  private handleExceptions(error: any) {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
