import { Injectable } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

export type SiteSettings = { description: string; upworkUrl: string; contactLabel: string; heroEyebrow: string; heroLine1: string; heroLine2: string };
const defaults: SiteSettings = { description: 'I’m Jamshed, a Video Editor with 5+ years of experience creating engaging, conversion-focused UGC ads, AI videos, VSLs, eCommerce product ads and social media content.', upworkUrl: 'https://www.upwork.com/freelancers/~017b6b532ce40f11cf', contactLabel: 'Get In Touch', heroEyebrow: 'AI VIDEO EDITOR | UGC ADS | VSLs', heroLine1: 'VIDEOS THAT', heroLine2: 'STOP THE SCROLL' };

@Injectable()
export class SettingsService {
  private readonly file = join(process.cwd(), 'data', 'settings.json');
  async get(): Promise<SiteSettings> { try { return { ...defaults, ...JSON.parse(await fs.readFile(this.file, 'utf8')) }; } catch { await this.save(defaults); return defaults; } }
  async save(settings: Partial<SiteSettings>): Promise<SiteSettings> { const next = { ...(await this.getSafe()), ...settings }; await fs.mkdir(join(process.cwd(), 'data'), { recursive: true }); await fs.writeFile(this.file, JSON.stringify(next, null, 2), 'utf8'); return next; }
  private async getSafe(): Promise<SiteSettings> { try { return { ...defaults, ...JSON.parse(await fs.readFile(this.file, 'utf8')) }; } catch { return defaults; } }
}
