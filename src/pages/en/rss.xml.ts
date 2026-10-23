import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) => data.lang === 'en');
  const sortedPosts = posts.sort((a, b) => {
    const diff = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    if (diff !== 0) return diff;
    return (b.data.issue || '').localeCompare(a.data.issue || '');
  });

  return rss({
    title: 'Everyday AI Lab | Practical AI Experiments',
    description: 'Only about AI in real life. Actionable experiments, zero-code workflows, and habit shifts for ordinary people.',
    site: context.site || 'https://0500005.xyz',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/en/posts/${post.id.replace(/^en\//, '')}/`,
    })),
    customData: `<language>en-US</language>`,
  });
}
