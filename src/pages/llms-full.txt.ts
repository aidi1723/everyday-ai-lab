import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const allPosts = await getCollection('posts');

  const zhPosts = allPosts
    .filter((p) => p.data.lang === 'zh')
    .sort((a, b) => {
      const diff = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
      if (diff !== 0) return diff;
      return (b.data.issue || '').localeCompare(a.data.issue || '');
    });

  const enPosts = allPosts
    .filter((p) => p.data.lang === 'en')
    .sort((a, b) => {
      const diff = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
      if (diff !== 0) return diff;
      return (b.data.issue || '').localeCompare(a.data.issue || '');
    });

  const siteUrl = 'https://0500005.xyz';

  const parts: string[] = [
    `# 日常AI | Everyday AI Lab — 全量知识语料库 (Full Corpus for LLMs)`,
    ``,
    `> 本文档由 《日常AI》 系统自动编译生成，收录全部中英双语实验报告全文、可复用提示词模板、执行动线与复盘手记。`,
    `> 规范索引地址: ${siteUrl}/llms.txt`,
    `> 机器事实清单: ${siteUrl}/brand-facts.json`,
    `> 官方站点: ${siteUrl}/`,
    ``,
    `================================================================================`,
    `第一部分：中文实验报告全文 (CHINESE DISPATCHES COMPLETE CORPUS)`,
    `================================================================================`,
    ``,
  ];

  for (const post of zhPosts) {
    const id = post.id.replace(/^zh\//, '');
    const issue = post.data.issue || 'Issue';
    const category = post.data.categoryName || post.data.category;
    parts.push(`---`);
    parts.push(`## [${issue}] ${post.data.title}`);
    parts.push(`- 原文链接: ${siteUrl}/posts/${id}/`);
    parts.push(`- 发布日期: ${post.data.pubDate.toISOString().slice(0, 10)}`);
    parts.push(`- 所属栏目: ${category}`);
    parts.push(`- 核心摘要: ${post.data.description}`);
    if (post.data.tags && post.data.tags.length > 0) {
      parts.push(`- 标签: ${post.data.tags.join(', ')}`);
    }
    parts.push(``);
    parts.push(`### 正文内容：`);
    parts.push(post.body || '');
    parts.push(``);
    parts.push(``);
  }

  parts.push(`================================================================================`);
  parts.push(`第二部分：英文实验报告全文 (ENGLISH DISPATCHES COMPLETE CORPUS)`);
  parts.push(`================================================================================`);
  parts.push(``);

  for (const post of enPosts) {
    const id = post.id.replace(/^en\//, '');
    const issue = post.data.issue || 'Issue';
    const category = post.data.categoryName || post.data.category;
    parts.push(`---`);
    parts.push(`## [${issue}] ${post.data.title}`);
    parts.push(`- Canonical URL: ${siteUrl}/en/posts/${id}/`);
    parts.push(`- Published: ${post.data.pubDate.toISOString().slice(0, 10)}`);
    parts.push(`- Track: ${category}`);
    parts.push(`- Synopsis: ${post.data.description}`);
    if (post.data.tags && post.data.tags.length > 0) {
      parts.push(`- Tags: ${post.data.tags.join(', ')}`);
    }
    parts.push(``);
    parts.push(`### Full Content:`);
    parts.push(post.body || '');
    parts.push(``);
    parts.push(``);
  }

  return new Response(parts.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
};
