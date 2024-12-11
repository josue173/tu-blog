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
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class BlogsService {
  private readonly logger = new Logger('BlogsService');
  constructor(
    @InjectRepository(Blog)
    private readonly _blogRepository: Repository<Blog>,
    @InjectRepository(Category)
    private readonly _categoryRepository: Repository<Category>,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    try {
      const { categories } = createBlogDto;

      // Ensure categories are valid and exist in the database
      const validCategories: string[] = await Promise.all(
        categories.map(async (cat_id) => {
          const category = await this._categoryRepository.findOne({
            where: { cat_id },
          });
          if (!category) {
            throw new Error(`Category with ID ${cat_id} not found`);
          }
          return cat_id; // Return the valid UUID
        }),
      );

      // Create the blog entity and assign valid category UUIDs
      const blog: Blog = this._blogRepository.create({
        ...createBlogDto,
        // categories: validCategories, // Store only the string array of UUIDs
      });

      const newCategories = new Category();
      categories.forEach((category) => {
        newCategories.cat_id = category;
      });
      blog.categories = validCategories;
      console.log(blog.categories);

      // Save the blog entity
      await this._blogRepository.save(blog);

      return blog;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this._blogRepository
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
        .select(['blog', 'owner.user_id'])
        .getMany();
      console.log(blog);

      blog.forEach((blog) => {
        const { blog_owner } = blog;
        console.log(blog_owner);
      });

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
    });

    const blog_s = await this._blogRepository
      .createQueryBuilder('blog')
      .leftJoin('blog.blog_owner', 'owner') // Join with the owner table
      .where('blog.blog_id = :blog_id', { blog_id })
      .select('owner.user_id', 'ownerId') // Select only the owner's user_id
      .getRawOne();

    if (user.user_id != blog_s.ownerId) {
      throw new UnauthorizedException('This is not your blog');
    }

    try {
      await this._blogRepository.save(blog);
      return user;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(blog_id: string, user: User) {
    const blog = await this.findByIdOrName(blog_id);
    const blog_s = await this._blogRepository
      .createQueryBuilder('blog')
      .leftJoin('blog.blog_owner', 'owner') // Join with the owner table
      .where('blog.blog_id = :blog_id', { blog_id })
      .select('owner.user_id', 'ownerId') // Select only the owner's user_id
      .getRawOne();

    if (user.user_id != blog_s.ownerId) {
      throw new UnauthorizedException('This is not your blog');
    }
    await this._blogRepository.remove(blog);
  }

  private handleExceptions(error: any) {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
