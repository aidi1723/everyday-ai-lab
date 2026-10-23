import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) => data.lang === 'zh');
  const sortedPosts = posts.sort((a, b) => {
    const diff = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    if (diff !== 0) return diff;
    return (b.data.issue || '').localeCompare(a.data.issue || '');
  });

  return rss({
    title: '日常AI | Everyday AI Lab',
    description: '只聊生活中的 AI，记录普通人的日常实践。真实生活实验、工作流拆解与习惯进化。',
    site: context.site || 'https://0500005.xyz',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.id.replace(/^zh\//, '')}/`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
