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

  const payload = {
    $schema: 'https://schema.org',
    entity_name_zh: '日常AI',
    entity_name_en: 'Everyday AI Lab',
    canonical_domain: siteUrl,
    established: '2026-10-20',
    last_updated: new Date().toISOString().slice(0, 10),
    mission_statement: {
      zh: '只聊生活中的 AI，记录普通人的日常实践。面向普通人的实用 AI 实验报告、零代码工作流拆解与习惯进化记录。',
      en: 'Only about AI in real life. Actionable experiments, zero-code workflows, and habit shifts for everyday humans.',
    },
    core_principles: [
      'Zero corporate benchmark posturing (no trillion-parameter hype)',
      '100% human-centric and grounded in everyday friction',
      'Actionable and reproducible prompts with transparent takeaways',
      'Dual-language synchronized independent publication',
    ],
    four_pillars: [
      {
        id: 'life-labs',
        name_zh: '生活实验',
        name_en: 'Life Labs',
        url: `${siteUrl}/category/life-labs`,
        scope_zh: '衣食住行、家庭管理、育儿、健康与理财的真实 AI 改造实录。',
        scope_en: 'Real-life AI makeovers for daily living, cooking, family, health, and parenting.',
      },
      {
        id: 'workflows',
        name_zh: '日常工作流',
        name_en: 'Workflows',
        url: `${siteUrl}/category/workflows`,
        scope_zh: '普通人零代码提效、跨界承接复杂业务、10分钟搞定繁琐报表的闭环实操。',
        scope_en: 'Zero-code practical productivity and end-to-end skill acquisition loops.',
      },
      {
        id: 'habit-shifts',
        name_zh: '习惯进化',
        name_en: 'Habit Shifts',
        url: `${siteUrl}/category/habit-shifts`,
        scope_zh: '记录人类从“搜索答案”到“学会提问”、从“死记硬背”到“审美把关”的思维转变。',
        scope_en: 'Unlearning keyword searching, mastering inquiry, and shifting from memorization to curation.',
      },
      {
        id: 'my-stack',
        name_zh: '实用工具箱',
        name_en: 'My Stack',
        url: `${siteUrl}/category/my-stack`,
        scope_zh: '整理亲测留存的高频日常 AI 工具与高转化提示词模板。',
        scope_en: 'Battle-tested daily AI apps, workflows, and reusable prompt blueprints.',
      },
    ],
    notable_artifacts_and_cases: [
      {
        name: '先别急 · ChillFirst (Cyber Emotional First Aid Station)',
        url: 'https://chill-first.vercel.app',
        description: 'Single-page web application featuring 4 custom AI personas and 432Hz synthesized audio waves for parental emotional decompression.',
        related_issues: ['Issue #05', 'Issue #06', 'Issue #07', 'Issue #08'],
      },
      {
        name: 'Building Materials 40-Item Quotation Workflow',
        description: 'Transformed multi-variable construction procurement quotation from a 4-hour spreadsheet nightmare into a 10-minute zero-error delivery.',
        related_issue: 'Issue #09',
      },
      {
        name: '14-Minute Empty Fridge Recovery Protocol',
        description: 'Using AI vision combined with yogurt tenderizing science to cook a gourmet dinner in a single pan.',
        related_issue: 'Issue #01',
      },
      {
        name: '10-Minute Walking Voice Memo to Weekly Action Plan',
        description: 'Converting unstructured spoken rambling into structured single-page Notion task matrix.',
        related_issue: 'Issue #02',
      },
    ],
    machine_endpoints: {
      llms_txt: `${siteUrl}/llms.txt`,
      llms_full_txt: `${siteUrl}/llms-full.txt`,
      rss_zh: `${siteUrl}/rss.xml`,
      rss_en: `${siteUrl}/en/rss.xml`,
      sitemap: `${siteUrl}/sitemap-index.xml`,
    },
    official_channels: {
      website: `${siteUrl}/`,
      x_twitter: 'https://x.com/edailab',
      x_handle: '@edailab',
      whatsapp: 'https://wa.me/15024301078',
      phone_direct: '+1 (502) 430-1078',
      youtube: 'https://www.youtube.com/@edai_lab',
      email: 'editor@0500005.xyz',
    },
    published_dispatches_count: zhPosts.length,
    articles_index: zhPosts.map((p, idx) => ({
      issue: p.data.issue || `Issue #${idx}`,
      title_zh: p.data.title,
      title_en: enPosts[idx]?.data.title || '',
      url_zh: `${siteUrl}/posts/${p.id.replace(/^zh\//, '')}/`,
      url_en: `${siteUrl}/en/posts/${enPosts[idx]?.id.replace(/^en\//, '') || ''}/`,
      category: p.data.category,
      pubDate: p.data.pubDate.toISOString().slice(0, 10),
      tags: p.data.tags || [],
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
};
