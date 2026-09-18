import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';

class LoginDto { @IsString() @MinLength(1) password!: string; }

@Controller('api/auth')
export class AuthController {
  @Post('login')
  login(@Body() body: LoginDto) {
    const expected = process.env.ADMIN_PASSWORD || 'admin123';
    if (body.password !== expected) throw new UnauthorizedException('Invalid password');
    return { token: 'admin-session', message: 'Login successful' };
  }
}
