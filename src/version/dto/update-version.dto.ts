import { PartialType } from '@nestjs/swagger';
import { CreateVersionDto } from './create-version.dto';

export class UpdateVersionDto extends PartialType(CreateVersionDto) {}
