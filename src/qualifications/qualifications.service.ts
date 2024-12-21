import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateQualificationDto } from './dto/create-qualification.dto';
import { UpdateQualificationDto } from './dto/update-qualification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Qualification } from './entities/qualification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Blog } from 'src/blogs/entities/blog.entity';

@Injectable()
export class QualificationsService {
  private readonly logger = new Logger('QualificationsService');
  constructor(
    @InjectRepository(Qualification)
    private readonly _quaRepository: Repository<Qualification>,
    @InjectRepository(Blog)
    private readonly _blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}
  async create(createQualificationDto: CreateQualificationDto, user: User) {
    try {
      const { qua_blog, qualification } = createQualificationDto;
      const blogExists: Blog = await this._blogRepository.findOneBy({
        blog_id: qua_blog,
      });
      if (!blogExists) {
        throw new Error('Blog not found.');
      }

      const quaDuplicated = await this._quaRepository.findOneBy({
        qua_owner: user,
        qua_blog: blogExists,
      });
      if (quaDuplicated) throw new BadRequestException();

      const newBlog = await this._quaRepository.create({
        qualification,
        qua_owner: user,
        qua_blog: blogExists,
      });

      return await this._quaRepository.save(newBlog);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  update(id: number, updateQualificationDto: UpdateQualificationDto) {
    return `This action updates a #${id} qualification`;
  }

  remove(id: number) {
    return `This action removes a #${id} qualification`;
  }

  private handleExceptions(error: any) {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
