import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { AuthController } from './auth.controller';
import { UploadController } from './upload.controller';
@Module({ controllers: [SettingsController, AuthController, UploadController], providers: [SettingsService] })
export class AppModule {}
