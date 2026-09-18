import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { promises as fs } from 'node:fs';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

class VideoMetaDto { @IsString() @MaxLength(100) title!: string; @IsOptional() @IsString() @MaxLength(300) tags?: string; @IsOptional() @IsString() @MaxLength(1000) description?: string; }
class VideoUpdateDto { @IsOptional() @IsString() @MaxLength(100) title?: string; @IsOptional() @IsString() @MaxLength(300) tags?: string | string[]; @IsOptional() @IsString() @MaxLength(1000) description?: string; }
class VideoOrderDto { ids!: string[]; }
const defaults = { title: '', tags: '', description: '' };

@Controller('api/uploads')
export class UploadController {
  private readonly library = join(process.cwd(), 'data', 'videos.json');
  @Get('videos') async list() { try { return JSON.parse(await fs.readFile(this.library, 'utf8')); } catch { return []; } }
  @Put('videos/order') async reorder(@Body() body: VideoOrderDto) { const videos = await this.list(); const rank = new Map((body.ids || []).map((id, index) => [id, index])); const ordered = [...videos].sort((a: any, b: any) => (rank.get(a.id) ?? videos.length) - (rank.get(b.id) ?? videos.length)); await fs.writeFile(this.library, JSON.stringify(ordered, null, 2), 'utf8'); return ordered; }
  @Put('video/:id') async update(@Param('id') id: string, @Body() meta: VideoUpdateDto) { const videos = await this.list(); const index = videos.findIndex((item: any) => item.id === id); if (index < 0) return { error: 'Video not found' }; const current = videos[index]; videos[index] = { ...current, ...meta, tags: Array.isArray(meta.tags) ? meta.tags : meta.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || current.tags }; await fs.writeFile(this.library, JSON.stringify(videos, null, 2), 'utf8'); return videos[index]; }
  @Delete('video/:id') async remove(@Param('id') id: string) { const videos = await this.list(); const item = videos.find((entry: any) => entry.id === id); if (!item) return { error: 'Video not found' }; const remaining = videos.filter((entry: any) => entry.id !== id); await fs.writeFile(this.library, JSON.stringify(remaining, null, 2), 'utf8'); if (item.url?.startsWith('/uploads/')) { try { await fs.unlink(join(process.cwd(), item.url.replace('/uploads/', 'uploads/'))); } catch {} } return { deleted: true, id }; }
  @Post('video')
  @UseInterceptors(FileInterceptor('video', { limits: { fileSize: 250 * 1024 * 1024 }, storage: diskStorage({ destination: './uploads', filename: (_req, file, cb) => cb(null, `${randomUUID()}${extname(file.originalname)}`) }), fileFilter: (_req, file, cb) => cb(null, ['video/mp4','video/webm','video/quicktime'].includes(file.mimetype)) }))
  async upload(@UploadedFile() file: Express.Multer.File, @Body() meta: VideoMetaDto) { const item = { id: randomUUID(), ...defaults, ...meta, tags: meta.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [], name: file.originalname, url: `/uploads/${file.filename}`, size: file.size, type: file.mimetype, createdAt: new Date().toISOString() }; const videos = await this.list(); videos.unshift(item); await fs.mkdir(join(process.cwd(), 'data'), { recursive: true }); await fs.writeFile(this.library, JSON.stringify(videos, null, 2), 'utf8'); return item; }
}
