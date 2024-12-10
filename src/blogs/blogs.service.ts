import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { User } from 'src/users/entities/user.entity';

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

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this._blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.blog_owner', 'owner') // Join the blog_owner relation
      .select([
        'blog', // Select all blog fields
        'owner.username', // Select only the username field from the owner
      ])
      .take(limit)
      .skip(offset)
      .getMany();

    // return this._blogRepository.find({
    //   take: limit,
    //   skip: offset,
    //   relations: ['blog_owner'], // Include the related 'blog_owner' entity
    // });
  }

  async findByIdOrName(param: string) {
    if (!param) {
      throw new BadRequestException(
        'Debe proporcionar un criterio de búsqueda.',
      );
    }
    try {
      const blog = await this._blogRepository
        .createQueryBuilder('blog')
        .where('blog.blog_id = :param', { param })
        .orWhere('blog.blog_name LIKE :name', { name: `%${param}%` }) // Búsqueda parcial por nombre
        .leftJoinAndSelect('blog.blog_owner', 'owner') // Si quieres incluir datos del propietario
        .select(['blog', 'owner.username'])
        .getMany();

      if (!blog) {
        throw new BadRequestException(
          `No se encontró ningún blog con: ${param}`,
        );
      }

      return blog;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(blog_id: string, updateBlogDto: UpdateBlogDto, user: User) {
    const blog = await this._blogRepository.preload({
      blog_id,
      ...updateBlogDto,
    });

    const blog_owner = await this._blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.blog_owner', 'owner') // Join with the owner (User entity)
      .where('blog.blog_id = :blog_id', { blog_id })
      .getOne(); // Get the single blog record

    // const 
    console.log(blog_owner.blog_owner);
    // console.log(user);

    if (user.user_id != updateBlogDto.blog_owner) {
      throw new UnauthorizedException();
    }

    try {
      await this._blogRepository.save(blog);
      return user;
    } catch (error) {
      this.handleExceptions(error);
    }
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
