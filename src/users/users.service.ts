import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Role } from 'src/roles/entities/role.entity';
import { Blog } from 'src/blogs/entities/blog.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
    private readonly _jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { user_password, ...userData } = createUserDto;

      const user = this._userRepository.create({
        ...userData,
        user_password: bcrypt.hashSync(user_password, 10),
      });

      user.roles = createUserDto.user_role.map((id) => {
        const role = new Role();
        role.id = id;
        return role;
      });


      await this._userRepository.save(user);
      delete user.user_password;

      return {
        ...user,
        token: this.getJwt({ user_id: user.user_id }),
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { user_password, user_email } = loginUserDto;
    const user = await this._userRepository.findOne({
      where: { user_email },
      select: { user_email: true, user_password: true, user_id: true },
    });

    if (!user) throw new UnauthorizedException('Invalid email');

    if (!bcrypt.compareSync(user_password, user.user_password))
      throw new UnauthorizedException('Invalid password');

    return {
      ...user,
      token: this.getJwt({ user_id: user.user_id }),
    };
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this._userRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(user_id: string) {
    const role = await this._userRepository.findOneBy({ user_id });
    if (!role) {
      throw new NotFoundException(`Role with ID: ${user_id} not found`);
    }
    return role;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this._userRepository.preload({
      user_id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`Role with ${id} not found`);
    }

    try {
      await this._userRepository.save(user);
      return user;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private getJwt(payload: JwtPayload) {
    const token = this._jwtService.sign(payload);
    return token;
  }

  private handleExceptions(error: any) {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
