import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  controllers: [UsersController],
  exports: [UsersService, JwtStrategy, PassportModule, JwtModule],
  imports: [
    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '12h',
          },
        };
      },
    }),

    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: '12h',
    //   },
    // }),
  ],
  providers: [UsersService, JwtStrategy],
})
export class UsersModule {}
