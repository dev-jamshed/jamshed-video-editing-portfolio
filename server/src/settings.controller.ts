import { Body, Controller, Get, Put } from '@nestjs/common';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { SettingsService } from './settings.service';

class UpdateSettingsDto {
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsUrl() upworkUrl?: string;
  @IsOptional() @IsString() @MaxLength(60) contactLabel?: string;
  @IsOptional() @IsString() @MaxLength(100) heroEyebrow?: string;
  @IsOptional() @IsString() @MaxLength(80) heroLine1?: string;
  @IsOptional() @IsString() @MaxLength(80) heroLine2?: string;
}

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}
  @Get() get() { return this.settings.get(); }
  @Put() update(@Body() body: UpdateSettingsDto) { return this.settings.save(body); }
}
