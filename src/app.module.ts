import { Module } from '@nestjs/common';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [RolesModule],
  controllers: [RolesController],
  providers: [],
})
export class AppModule {}
