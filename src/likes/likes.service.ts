import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
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

  findAll() {
    return `This action returns all likes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
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
