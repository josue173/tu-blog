import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { PaginationDto } from 'src/commom/dto/pagination.dto';

@Injectable()
export class RolesService {
  private readonly logger = new Logger('RolesService');

  constructor(
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = this._roleRepository.create(createRoleDto);
      await this._roleRepository.save(role);
      return role;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this._roleRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const role = await this._roleRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException(`Role with ID: ${id} not found`);
    }
    return role;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  async remove(id: string) {
    const role = await this.findOne(id);
    await this._roleRepository.remove(role);
  }

  private handleExceptions(error: any) {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
