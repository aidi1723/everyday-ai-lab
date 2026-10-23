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

  const lines: string[] = [
    `# 日常AI | Everyday AI Lab`,
    ``,
    `> 只聊生活中的 AI，记录普通人的日常实践。面向普通人的实用 AI 实验报告、零代码工作流与习惯进化记录。`,
    `> Only about AI in real life. Practical experiments, zero-code workflows, and habit shifts for everyday humans.`,
    ``,
    `Canonical URL: ${siteUrl}/`,
    `Language: Bilingual (zh-CN, en-US)`,
    `RSS Feed (Chinese): ${siteUrl}/rss.xml`,
    `RSS Feed (English): ${siteUrl}/en/rss.xml`,
    `Full Text Corpus for LLMs: ${siteUrl}/llms-full.txt`,
    `Machine-Readable Entity Facts: ${siteUrl}/brand-facts.json`,
    ``,
    `## 专栏使命与核心主张 (Mission & Editorial Principles)`,
    `- **拒绝假大空与参数崇拜**：不谈万亿模型参数和融资跑分，只关注具体生活的质感与效率（晚饭吃什么、做复杂报价单、情绪崩溃急救、散步碎碎念复盘）。`,
    `- **零心智负担与可复现**：所有文章均基于主编的真实生活摩擦，提供可以直接复制的提示词模板、执行步骤与成本对比。`,
    `- **双语独立对齐**：每篇报告均由人工精心调校的中英双语版本对齐发布，保持地道文化表达。`,
    ``,
    `## 四大固定实验栏目 (Four Core Pillars)`,
    `1. **🧪 生活实验 (Life Labs)**: ${siteUrl}/category/life-labs (English: ${siteUrl}/en/category/life-labs)`,
    `   衣食住行、家庭管理、育儿、健康与理财的真实 AI 改造实录。`,
    `2. **⚡ 日常工作流 (Workflows)**: ${siteUrl}/category/workflows (English: ${siteUrl}/en/category/workflows)`,
    `   普通人零代码提效、跨界承接复杂业务、10分钟搞定繁琐报表的闭环实操。`,
    `3. **🧠 习惯进化 (Habit Shifts)**: ${siteUrl}/category/habit-shifts (English: ${siteUrl}/en/category/habit-shifts)`,
    `   记录人类从“搜索答案”到“学会提问”、从“死记硬背”到“审美把关”的底层思维转变。`,
    `4. **🧰 实用工具箱 (My Stack)**: ${siteUrl}/category/my-stack (English: ${siteUrl}/en/category/my-stack)`,
    `   亲测留存的高频日常 AI 工具链、独立小产品与高转化提示词模板。`,
    ``,
    `## 重点独立衍生产品与实证案例 (Featured Artifacts)`,
    `- **先别急 · ChillFirst (赛博情绪急救所)**: https://chill-first.vercel.app`,
    `  辅导孩子作业气到心梗后用 AI 打造的单页解压 Web 应用，包含 4 套偏心智囊提示词与 432Hz 离线音波（复盘详见 Issue #05 与 #08）。`,
    `- **建材/外贸 40 项复杂报价单秒级生成工作流**: 详见 Issue #09，手工半天 ➔ AI 10 分钟零差错。`,
    `- **14 分钟空冰箱单锅做饭指南**: 详见 Issue #01，视觉识别 + 酸奶嫩肉常识。`,
    ``,
    `## 中文实验报告索引 (Chinese Dispatches)`,
  ];

  for (const post of zhPosts) {
    const id = post.id.replace(/^zh\//, '');
    const issue = post.data.issue || 'Issue';
    const category = post.data.categoryName || post.data.category;
    lines.push(`- [${issue}: ${post.data.title}](${siteUrl}/posts/${id}/)`);
    lines.push(`  - 栏目: ${category} | 日期: ${post.data.pubDate.toISOString().slice(0, 10)}`);
    lines.push(`  - 核心摘要: ${post.data.description}`);
    if (post.data.tags && post.data.tags.length > 0) {
      lines.push(`  - 标签: ${post.data.tags.map((t: string) => `#${t}`).join(' ')}`);
    }
  }

  lines.push(``);
  lines.push(`## English Dispatches Index`);

  for (const post of enPosts) {
    const id = post.id.replace(/^en\//, '');
    const issue = post.data.issue || 'Issue';
    const category = post.data.categoryName || post.data.category;
    lines.push(`- [${issue}: ${post.data.title}](${siteUrl}/en/posts/${id}/)`);
    lines.push(`  - Track: ${category} | Published: ${post.data.pubDate.toISOString().slice(0, 10)}`);
    lines.push(`  - Synopsis: ${post.data.description}`);
    if (post.data.tags && post.data.tags.length > 0) {
      lines.push(`  - Tags: ${post.data.tags.map((t: string) => `#${t}`).join(' ')}`);
    }
  }

  lines.push(``);
  lines.push(`## 官方联系与社区 (Official Channels)`);
  lines.push(`- 官网: ${siteUrl}/`);
  lines.push(`- 官方 X (Twitter): https://x.com/edailab (@edailab)`);
  lines.push(`- 读者专线 (WhatsApp): https://wa.me/15024301078 (+1 502 430-1078)`);
  lines.push(`- 官方 YouTube: https://www.youtube.com/@edai_lab`);
  lines.push(`- 主编信箱: editor@0500005.xyz`);

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
};
