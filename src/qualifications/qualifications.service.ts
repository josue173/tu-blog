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
      const blogExists: Blog = await this._blogRepository.findOne({
        where: { blog_id: qua_blog },
        relations: ['owner'], // Aquí agregas las relaciones que deseas cargar
      });
      if (!blogExists) {
        throw new Error('Blog not found.');
      }

      const quaDuplicated = await this._quaRepository.findOne({
        where: { qua_owner: user, qua_blog: blogExists },
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

  async update(
    id: string,
    updateQualificationDto: UpdateQualificationDto,
    user: User,
  ) {
    try {
      const { qualification, qua_blog } = updateQualificationDto;
      const blogExists: Blog = await this._blogRepository.findOne({
        where: { blog_id: qua_blog },
        relations: ['blog_owner'], // Aquí también agregas las relaciones necesarias
      });
      if (!blogExists) throw new Error('Blog not found.');

      const quaExists: Qualification = await this._quaRepository.findOne({
        where: { qua_id: id },
        relations: ['qua_owner', 'qua_blog'], // Asegúrate de incluir las relaciones necesarias
      });
      if (!quaExists) throw new Error('Qualification not found.');

      // if (user != quaExists.qua_owner) // Son instancias de la entidad User, se compara la referencia al obeto
      if (user.user_id != quaExists.qua_owner.user_id)
        throw new BadRequestException(`This is not your qualification`);

      const updatedQualification = await this._quaRepository.preload({
        qua_id: id,
        qualification,
      });

      if (!updatedQualification) {
        throw new BadRequestException('Qualification not found.');
      }

      return await this._quaRepository.save(updatedQualification);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // async remove(id: string, user: User) {
  //   const quaExists: Qualification = await this._quaRepository.findOne({
  //     where: { qua_id: id },
  //     relations: ['qua_owner', 'qua_blog'], // Asegúrate de incluir las relaciones necesarias
  //   });
  //   if (user.user_id != quaExists.qua_owner.user_id)
  //     throw new BadRequestException(`This is not your qualification`);
  //   return await this._quaRepository.remove(quaExists);
  // }

  private handleExceptions(error: any) {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
