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
      const { categories, ...blogData } = createBlogDto;

      // Ensure categories are valid and exist in the database
      const validCategories = await Promise.all(
        categories.map(async (cat_id) => {
          const category = await this._categoryRepository.findOne({
            where: { cat_id },
          });
          if (!category) {
            throw new Error(`Category with ID ${cat_id} not found`);
          }
          return category; // Return the Category entity, not just the UUID
        }),
      );

      // Create the blog entity and assign the Category entities
      const blog = this._blogRepository.create({
        ...blogData,
        categories: validCategories, // Assign the Category objects here
      });

      await this._blogRepository.save(blog);

      return blog;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async incrementView(blogId: string) {
    const blog = await this._blogRepository.findOneBy({ blog_id: blogId });

    if (!blog) {
      throw new Error('Blog not found');
    }

    blog.blog_views += 1;
    await this._blogRepository.save(blog);
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
      // blog.forEach((blog) => {
      //   const { blog_owner } = blog;
      //   console.log(blog_owner);
      // })
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
    try {
      // Busca el blog para verificar existencia y propiedad
      const existingBlog = await this._blogRepository.findOne({
        where: { blog_id },
      });

      if (!existingBlog) {
        throw new BadRequestException(`Blog with ID ${blog_id} not found.`);
      }

      // Verifica que el usuario sea el propietario del blog
      const blogOwner = await this._blogRepository
        .createQueryBuilder('blog')
        .leftJoin('blog.blog_owner', 'owner') // Join con la tabla del propietario
        .where('blog.blog_id = :blog_id', { blog_id })
        .select('owner.user_id', 'ownerId') // Selecciona solo el ID del propietario
        .getRawOne();

      if (user.user_id !== blogOwner.ownerId) {
        throw new UnauthorizedException('This is not your blog');
      }

      // Prepara las categorías
      let validCategories = null;
      if (updateBlogDto.categories) {
        validCategories = await Promise.all(
          updateBlogDto.categories.map(async (cat_id) => {
            const category = await this._categoryRepository.findOne({
              where: { cat_id },
            });
            if (!category) {
              throw new BadRequestException(
                `Category with ID ${cat_id} not found.`,
              );
            }
            return category;
          }),
        );
      }

      // Preload con las propiedades válidas
      const updatedBlog = await this._blogRepository.preload({
        blog_id,
        ...updateBlogDto,
        categories: validCategories || existingBlog.categories, // Asegura que las categorías sean correctas
      });

      if (!updatedBlog) {
        throw new BadRequestException(
          `Failed to preload blog with ID ${blog_id}.`,
        );
      }

      // Guarda los cambios
      const savedBlog = await this._blogRepository.save(updatedBlog);

      return savedBlog;
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
