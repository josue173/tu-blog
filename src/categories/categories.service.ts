import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/commom/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');

  constructor(
    @InjectRepository(Category)
    private readonly _categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this._categoryRepository.create(createCategoryDto);
      await this._categoryRepository.save(category);
      return category;
    } catch (error) {
      console.log(error);

      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this._categoryRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(cat_id: string) {
    const category = await this._categoryRepository.findOneBy({ cat_id });
    if (!category)
      throw new NotFoundException(`Category with ID: ${cat_id} not found`);
    return category;
  }

  async update(cat_id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this._categoryRepository.preload({
      cat_id: cat_id,
      ...updateCategoryDto,
    });
    try {
      await this._categoryRepository.save(category);
      return category;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await this._categoryRepository.remove(category);
  }

  private handleExceptions(error: any) {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
