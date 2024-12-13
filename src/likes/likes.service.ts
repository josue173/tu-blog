import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Blog } from 'src/blogs/entities/blog.entity';

@Injectable()
export class LikesService {
  private readonly logger = new Logger('LikesService');

  constructor(
    @InjectRepository(Like)
    private readonly _likeRepository: Repository<Like>,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(Blog)
    private readonly _blogRepository: Repository<Blog>,
  ) {}

  async create(createLikeDto: CreateLikeDto, user_like: User) {
    try {
      const { user_id } = user_like;
      const { like_blog, like } = createLikeDto;

      const user = await this._userRepository.findOneBy({ user_id });

      const blog = await this._blogRepository.findOneBy({
        blog_id: like_blog,
      });

      const buscarLike = await this.findByOwnerAndBlog(user, blog);

      if (buscarLike) {
        // throw new BadRequestException(`The like ${(await buscarLike).like_id}`); // Interesante
        throw new BadRequestException(
          `The like ${buscarLike.like_id} already exists`,
        );
      }

      const newLike: Like = await this._likeRepository.create({
        like,
        like_owner: user,
        like_blog: blog,
      });

      await this._likeRepository.save(newLike);

      return newLike;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(like_id: string) {
    try {
      const like = await this._likeRepository.findOneBy({ like_id });
      if (!like) {
        throw new NotFoundException(`Like with ID: ${like_id} not found`);
      }
      return like;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByOwnerAndBlog(like_owner: User, like_blog: Blog) {
    try {
      const like = await this._likeRepository.findOne({
        where: {
          like_owner: { user_id: like_owner.user_id },
          like_blog: { blog_id: like_blog.blog_id },
        },
        relations: ['like_owner', 'like_blog'],
      });

      return like;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  update(id: number, updateLikeDto: UpdateLikeDto) {
    return `This action updates a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }

  private handleExceptions(error: any) {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
