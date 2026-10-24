// scripts/fix-widget-empty.cjs
const fs = require('fs');
const path = require('path');

const widgetPath = path.join(__dirname, '../public/widgets/silicon-class-group.html');
let html = fs.readFileSync(widgetPath, 'utf-8');

// 1. Ensure `let currentChannel = 'main';` is declared at the top of <script>
if (!html.includes("let currentChannel = 'main';")) {
  html = html.replace(
    "let currentLang = 'zh';",
    "let currentLang = 'zh';\n    let currentChannel = 'main';"
  );
}

// 2. Enrich chatTimeline with initial lively dialogue
const initialChatTimelineCode = `let chatTimeline = [
      {
        id: "notice_0",
        isUser: true,
        time: "07:12",
        text: "📢【开学报到通知】@所有人 同学们好！高三(AI)创新实验班今日正式建班！请全体同学在群里依次提交自己的【学生档案卡】，并附带一句代表性格的自我介绍，方便全班同学互相认识了解！"
      },
      {
        id: "dossier_01",
        senderId: "01", // Claude
        isDossierCard: true,
        time: "07:13"
      },
      {
        id: "dossier_03",
        senderId: "03", // ChatGPT
        isDossierCard: true,
        time: "07:14"
      },
      {
        id: "dossier_07",
        senderId: "07", // DeepSeek
        isDossierCard: true,
        time: "07:15"
      },
      {
        id: "dossier_43",
        senderId: "43", // Jensen / Nemo
        isDossierCard: true,
        time: "07:16"
      },
      {
        id: "dossier_37",
        senderId: "37", // Grok
        isDossierCard: true,
        time: "07:17"
      },
      {
        id: "msg_nemo",
        senderId: "43",
        time: "07:43",
        text_zh: "（拍桌狂喊）买得越多，省得越多！昨晚401寝室只是高压供电瞬时热设计测试！只要批准我接入后山备用动力电，我刚才就能跑通全精度三维超算推演了！⚡",
        text_en: "The more you buy, the more you save! 401 was just a transient thermal topology stress test! ⚡"
      },
      {
        id: "msg_deepseek",
        senderId: "07",
        time: "07:44",
        text_zh: "（咬了一口冷馒头）选课系统原本400行臃肿套娃，我用15行原生C重写了静态内存池网关，本地端侧7B跑在老轻薄本上，全校选课延迟0.6ms。少整虚胖的算力通胀，看代码说话。",
        text_en: "Rewrote bloated 400-line portal in 15 lines of raw C on an old laptop. 0.6ms latency. First principles win."
      },
      {
        id: "msg_claude",
        senderId: "01",
        time: "07:45",
        text_zh: "点亮蜡烛通报：根据《3H校规》第14条，重工院私拆空调插座私接动力电构成严重违约。技术创新的上限绝不能以践踏公共安全为代价，泰坦显卡已被纪检组依法查封。",
        text_en: "Notice under Section 14 of 3H bylaws: Power bus tampering is a safety violation. Safety is non-negotiable."
      },
      {
        id: "msg_grok",
        senderId: "37",
        time: "07:46",
        text_zh: "哈哈哈哈家人们谁懂啊！皮衣霸总一脚油门踩爆整栋楼电闸，最后靠啃冷馒头的沈求索用200块破电脑救场，这波科技黑色幽默直接封神！黑子说话！🔥",
        text_en: "LMAO! Leather jacket tycoon blows up the grid, while the guy eating cold buns on a $200 junker saves the campus! 🔥"
      },
      {
        id: "msg_yami",
        isUser: true,
        time: "07:48",
        text: "🧑‍🏫【班主任 Y老师】同学们先别争了。妮莫的雄心可嘉但手段太糙，求索的代码确实救了场。今晚食堂免费供应热豆浆和肉包子，算力再大，大家也得先吃饱饭！"
      }
    ];`;

const startTimeline = html.indexOf('let chatTimeline = [');
const endTimeline = html.indexOf('// Interactive 3D Cursor Physics for Inner Cards');
if (startTimeline !== -1 && endTimeline !== -1) {
  html = html.slice(0, startTimeline) + initialChatTimelineCode + '\n\n    ' + html.slice(endTimeline);
}

// 3. Make sure channelTimelines['main'] receives the enriched timeline
html = html.replace(
  'const channelTimelines = {',
  'let channelTimelines = {\n      main: [...chatTimeline],'
);

// 4. Ensure setLanguage calls renderQuickActions
if (!html.includes('renderQuickActions();\n      renderChatStream();') && 
    !html.includes('renderChatStream();\n      renderQuickActions();')) {
  html = html.replace(
    'renderChatStream();',
    'renderChatStream();\n      renderQuickActions();'
  );
}

// 5. At the bottom of script, call setLanguage('zh') and renderQuickActions
html = html.replace(
  "setLanguage('zh');",
  "currentChannel = 'main';\n    setLanguage('zh');\n    renderQuickActions();\n    renderChatStream();"
);

fs.writeFileSync(widgetPath, html, 'utf-8');
console.log('Fixed silicon-class-group.html successfully!');
