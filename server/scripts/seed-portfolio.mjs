import { promises as fs } from 'node:fs';
import { join, relative, extname, basename } from 'node:path';

const root = join(process.cwd(), '..');
const source = join(root, 'PORTFOLIO_ORGANIZED');
const output = join(process.cwd(), 'data', 'videos.json');
const categoryInfo = {
  '01_AI_Video_Animation': ['AI Video', ['AI Video','Animation','Creative']],
  '02_AI_Avatar_UGC': ['AI Video', ['AI Video','AI Avatar','UGC']],
  '03_UGC_Talking_Head': ['UGC', ['UGC','Talking Head','Social Ads']],
  '04_Fitness_Health_Ads': ['Meta Ads', ['Meta Ads','Health','Performance Creative']],
  '05_Product_eCommerce_Ads': ['eCommerce', ['eCommerce','Product Ad','Social Ads']],
  '06_VSL_Product_Ads': ['VSL', ['VSL','Product Ad','Conversion']],
  '07_Sports_Reels': ['Reels', ['Reels','Sports','Short-Form']],
  '08_Motion_Graphics': ['Motion Graphics', ['Motion Graphics','Animated','Creative']],
  '09_Review': ['Review', ['Review','Needs Approval']]
};
async function walk(dir) { const entries = await fs.readdir(dir, { withFileTypes: true }); const files=[]; for (const entry of entries) { const path=join(dir,entry.name); if(entry.isDirectory()) files.push(...await walk(path)); else if(['.mp4','.mov','.webm'].includes(extname(entry.name).toLowerCase())) files.push(path); } return files; }
const files = await walk(source); const videos = files.map(file => { const rel=relative(source,file).replaceAll('\\','/'); const folder=rel.split('/')[0]; const [category,tags]=categoryInfo[folder] || ['Review',['Review']]; const title=basename(file,extname(file)).replace(/\s+/g,' ').trim(); return { id: crypto.randomUUID(), title, category, tags, description:`${category} portfolio project edited for social-first video content.`, name:basename(file), url:`/portfolio/${rel.split('/').map(encodeURIComponent).join('/')}`, size:0, type:`video/${extname(file).slice(1)}`, createdAt:new Date().toISOString() }; });
await fs.writeFile(output, JSON.stringify(videos,null,2)); console.log(`Seeded ${videos.length} portfolio videos.`);
