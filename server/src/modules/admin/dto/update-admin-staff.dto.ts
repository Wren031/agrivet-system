import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminStaffDto } from './create-admin-staff.dto';

export class UpdateAdminStaffDto extends PartialType(CreateAdminStaffDto) {}
