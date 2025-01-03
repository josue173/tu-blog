import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { QualificationsService } from './qualifications.service';
import { CreateQualificationDto } from './dto/create-qualification.dto';
import { UpdateQualificationDto } from './dto/update-qualification.dto';
import { Auth, GetUser } from 'src/users/decorators';
import { User } from 'src/users/entities/user.entity';

@Auth()
@Controller('qualifications')
export class QualificationsController {
  constructor(private readonly qualificationsService: QualificationsService) {}

  @Post()
  create(
    @Body() createQualificationDto: CreateQualificationDto,
    @GetUser() user: User,
  ) {
    return this.qualificationsService.create(createQualificationDto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQualificationDto: UpdateQualificationDto,
    @GetUser() user: User,
  ) {
    return this.qualificationsService.update(id, updateQualificationDto, user);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string, @GetUser() user: User) {
  //   return this.qualificationsService.remove(id, user);
  // }
}
