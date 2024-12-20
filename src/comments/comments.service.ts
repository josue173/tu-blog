import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
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
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
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
      return comments.map((comment) => ({
        comm_id: comment.comm_id,
        comm_text: comment.comm_text,
        owner: {
          id: comment.comm_owner.user_id,
          name: comment.comm_owner.user_first_name,
        },
        blog: {
          id: comment.comm_blog.blog_id,
          title: comment.comm_blog.blog_name,
        },
      }));
    } catch (error) {
      throw new Error(`Failed to retrieve comments: ${error.message}`);
    }
  }

  async findOne(comm_id: string) {
    const category = await this._commentRepository.findOneBy({ comm_id });
    if (!category)
      throw new NotFoundException(`Comment with ID: ${comm_id} not found`);
    return category;
  }

  // update(id: number, updateCommentDto: UpdateCommentDto) {
  //   return `This action updates a #${id} comment`;
  // }

  async remove(comm_id: string, user: User) {
    const comment = await this.findOne(comm_id);
    const comment_owner = await this._userRepository.findOneBy({
      user_id: user.user_id,
    });
    if (user != comment_owner) throw new Error('This is not your comment!');

    await this._commentRepository.remove(comment);
  }

  private handleExceptions(error: any) {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
