import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  return rss({
    title: '日常AI | Everyday AI Lab',
    description: '只聊生活中的 AI，记录普通人的日常实践。Only about AI in real life. Practical experiments for everyday humans.',
    site: context.site || 'https://0500005.xyz',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: post.data.lang === 'en' 
        ? `/en/posts/${post.id.replace(/^en\//, '')}/`
        : `/posts/${post.id.replace(/^zh\//, '')}/`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
