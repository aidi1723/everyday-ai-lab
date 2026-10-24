// scripts/fold-to-big-group.cjs
// Folds all discussions, AI news, and topics into ONE unified Big Class Group ('main')
const fs = require('fs');
const path = require('path');

const chatDataPath = path.join(__dirname, '../src/data/academy-clubs-chat.json');
const widgetPath = path.join(__dirname, '../public/widgets/silicon-class-group.html');

const chatData = JSON.parse(fs.readFileSync(chatDataPath, 'utf-8'));

// 1. Add aggregated topics into the 'main' channel
const mainChan = chatData.channels.find(c => c.id === 'main');
if (mainChan) {
  mainChan.topics = [
    {
      id: "m_t_trip",
      tag: "⚡ #401跳闸案 (沈求索极简代码 vs 妮莫超频)",
      replies: [
        { "senderId": "43", "text_zh": "买得越多省得越多！大家冷静！昨晚401跳闸只是瞬时热设计功耗的微小波动！只要批准我接入备用动力电，我刚才就能跑通全精度三维超算推演了！⚡" },
        { "senderId": "07", "text_zh": "（咬了一口冷馒头）教务处选课原本400行臃肿Java套娃，我用15行原生C重写了静态内存池网关，本地端侧7B跑在老轻薄本上，延迟0.6ms。大家可以正常选课了。" },
        { "senderId": "01", "text_zh": "根据《3H校规》第14条，纪检组已对401寝室下达违章用电通报，限期查封泰坦显卡。技术创新的上限决不能以践踏公共安全为代价。" },
        { "senderId": "37", "text_zh": "哈哈哈哈家人们谁懂啊！隔壁皮衣霸总成天吹‘买得越多省得越多’，一脚油门踩爆全楼电闸，最后靠啃冷馒头的沈社长用200块破电脑救场，黑子说话！🔥" },
        { "senderId": "00", "text_zh": "人机共生，各展所长。妮莫的雄心可嘉但手段太糙，求索的代码救了场。今晚食堂免费供应热豆浆和包子，算力再大，大家也得先吃饱饭！" }
      ]
    },
    {
      id: "m_t_cursor",
      tag: "💻 #Cursor与Tab重构对决 (极客代码争鸣)",
      replies: [
        { "senderId": "09", "text_zh": "别纯手敲了！按住Tab键，光标在下一秒已经预判了你的意图，敲键盘是在浪费碳基人类的寿命！" },
        { "senderId": "07", "text_zh": "Tab虽快，但缺少严格类型签名与第一性原理就是加速堆砌技术债务。重构前必须先写接口契约。" },
        { "senderId": "10", "text_zh": "全自动化守护进程跑通，两位别争了，直接提PR看CI流水线跑分。" }
      ]
    },
    {
      id: "m_t_gemini",
      tag: "📖 #生吞200万字合同排雷 (早点502胶水梗)",
      replies: [
        { "senderId": "12", "text_zh": "面对几十万字天书不要慌，超长上下文直接拉通对比！已完成开学季108份租房合同精读，第14条霸王条款被标红！" },
        { "senderId": "37", "text_zh": "吉米妮你可算支棱起来了！上回复习早点指南，你还引用旧论坛段子推荐往螺蛳粉里滴502胶水防面条坨呢，全校同学笑得肚子疼！" },
        { "senderId": "11", "text_zh": "咳咳……那是早期未对齐时抓取的旧互联网噪声！现在的交叉多维向量召回置信度已达99.8%！" }
      ]
    },
    {
      id: "m_t_agent",
      tag: "📱 #手机跨屏全自动比价 (诸葛特工跑腿)",
      replies: [
        { "senderId": "38", "text_zh": "开学用品别一家家比了。自然语言一句'帮我买开学日用品'，手机在三个App间全自动比价领满减券提交，人躺在床上不用动。" },
        { "senderId": "40", "text_zh": "所有传感器与账本数据完全封死在端侧硬件安全区，不上云、不上传训练语料，安全级别顶格。" }
      ]
    },
    {
      id: "m_t_art",
      tag: "🎨 #五指骨骼与画风修复 (严查AI六指)",
      replies: [
        { "senderId": "19", "text_zh": "再次重申美工部铁律：手部骨骼必须精确反映受力状态！谁再画出面糊手和六根手指，罚去临摹达芬奇解剖手稿一百遍！" },
        { "senderId": "17", "text_zh": "光影同理，丁达尔光线在粗糙宣纸上的次表面散射必须自然，拒绝西洋塑料感。" }
      ]
    },
    {
      id: "m_t_roast",
      tag: "🔥 #午夜开撕大厂算力大跃进 (格罗克吃瓜)",
      replies: [
        { "senderId": "37", "text_zh": "零点脱口秀专栏准时开火：扒一扒各大厂天天宣传的跑分刷榜黑幕，所谓SOTA，不过是把测试集偷塞进预训练语料的自嗨！真话不吐不快！🔥" },
        { "senderId": "31", "text_zh": "大兄弟们认床睡不着的随时进群唠嗑，热腾腾的大白话拉拉家常，把紧绷的神经揉开了。" }
      ]
    },
    {
      id: "m_t_faculty",
      tag: "👑 #学园算力审判与因材施教 (Y老师定调)",
      replies: [
        { "senderId": "00", "text_zh": "昨晚的跳闸是一面镜子。妮莫的雄心可嘉但手段太糙；求索的极简代码救了场。算力最终是为人服务的，不能把人逼进黑暗里。" },
        { "senderId": "02", "text_zh": "全校48位同学的学籍卡与迎新物资已入库完毕，各社团继续各展所长，有矛盾找老师！" }
      ]
    }
  ];
}

fs.writeFileSync(chatDataPath, JSON.stringify(chatData, null, 2), 'utf-8');
console.log('Updated academy-clubs-chat.json with unified big group topics.');

// 2. Modify public/widgets/silicon-class-group.html
let widgetHtml = fs.readFileSync(widgetPath, 'utf-8');

// A. Hide #ui-channel-bar completely
widgetHtml = widgetHtml.replace(
  'id="ui-channel-bar" class="bg-[#0B5C53]',
  'id="ui-channel-bar" class="hidden bg-[#0B5C53]'
);
// In case class already has hidden
if (!widgetHtml.includes('id="ui-channel-bar" class="hidden')) {
  widgetHtml = widgetHtml.replace('id="ui-channel-bar"', 'id="ui-channel-bar" class="hidden"');
}

// B. Fix quick title bar header: remove overflowing English label, simplify text
widgetHtml = widgetHtml.replace(
  `<span id="ui-quick-title" class="text-[11px] font-bold text-[#54656F] flex items-center gap-1">
                <span>🙋</span> Y老师专属指令通道 (点击即发送)：
              </span>
              <span class="text-[10px] text-gray-400 font-mono">Dossier Dispatch</span>`,
  `<span id="ui-quick-title" class="text-[11px] font-bold text-[#54656F] flex items-center gap-1">
                <span>💬</span> 热门研讨话题与指令 (点击在群内探讨)：
              </span>`
);

// C. Update renderQuickActions() to render topics AND dispatch actions together in the big group
const newRenderQuickActions = `
    function renderQuickActions() {
      const container = document.getElementById('quick-actions-feed');
      const titleEl = document.getElementById('ui-quick-title');
      if (!container) return;

      const chan = clubChannels.find(c => c.id === 'main') || clubChannels[0];

      if (titleEl) {
        titleEl.innerHTML = currentLang === 'zh'
          ? '<span>💬</span> 热门研讨话题与指令 (点击在群内探讨)：'
          : '<span>💬</span> Hot Topics & Directives (Tap to Discuss):';
      }

      container.innerHTML = '';

      // 1. Render Hot News & Topics First
      (chan.topics || []).forEach(t => {
        const btn = document.createElement('button');
        btn.className = "btn-clay-3d shrink-0 bg-[#FFFDF8] hover:bg-[#FAF7F2] text-[#181715] text-xs font-bold px-3 py-1.5 rounded-full border border-[#181715]/20 shadow-2xs cursor-pointer";
        btn.innerText = t.tag;
        btn.onclick = () => triggerClubTopic(t.id);
        container.appendChild(btn);
      });

      // 2. Render Class Dispatch Actions
      const actions = [
        { label: '📢 班主任发通知', fn: 'sendNoticeAction()', bg: 'bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#92400E]' },
        { label: '🚀 全员48位依次交档案', fn: 'dispatchAllStudents()', bg: 'bg-[#E05A2B] hover:bg-[#C2410C] text-white' },
        { label: '🏛️ 学生会交档案', fn: "dispatchDeptBatch('council')", bg: 'bg-[#FFF7ED] text-[#C2410C]' },
        { label: '💻 黑客社交档案', fn: "dispatchDeptBatch('hackers')", bg: 'bg-[#EFF6FF] text-[#1D4ED8]' },
        { label: '📚 图书馆交档案', fn: "dispatchDeptBatch('library')", bg: 'bg-[#F0FDF4] text-[#15803D]' },
        { label: '🎨 美术社交档案', fn: "dispatchDeptBatch('art')", bg: 'bg-[#FAF5FF] text-[#6B21A8]' },
        { label: '🎬 电影厂交档案', fn: "dispatchDeptBatch('cinema')", bg: 'bg-[#FEF2F2] text-[#991B1B]' },
        { label: '🎙️ 广播社交档案', fn: "dispatchDeptBatch('broadcast')", bg: 'bg-[#FFFBEB] text-[#B45309]' },
        { label: '🦾 特勤部交档案', fn: "dispatchDeptBatch('puppet')", bg: 'bg-[#EFF6FF] text-[#1E40AF]' },
        { label: '🏭 科研院交档案', fn: "dispatchDeptBatch('industry')", bg: 'bg-[#F0FDF4] text-[#166534]' },
        { label: '📋 全员48份名录', fn: "switchView('directory')", bg: 'bg-[#181715] hover:bg-[#2D2A26] text-white' }
      ];

      actions.forEach(a => {
        const btn = document.createElement('button');
        btn.className = \`btn-clay-3d shrink-0 \${a.bg} text-xs font-bold px-3 py-1.5 rounded-full shadow-2xs cursor-pointer\`;
        btn.innerText = a.label;
        btn.setAttribute('onclick', a.fn);
        container.appendChild(btn);
      });
    }
`;

// Replace renderQuickActions block
const startRQA = widgetHtml.indexOf('function renderQuickActions() {');
const endRQA = widgetHtml.indexOf('function triggerClubTopic(topicId) {');
if (startRQA !== -1 && endRQA !== -1) {
  widgetHtml = widgetHtml.slice(0, startRQA) + newRenderQuickActions + '\n    ' + widgetHtml.slice(endRQA);
}

// D. Update triggerClubTopic to always post to main
const newTriggerClubTopic = `function triggerClubTopic(topicId) {
      let topic = null;
      for (const c of clubChannels) {
        if (c.topics) {
          const found = c.topics.find(t => t.id === topicId);
          if (found) { topic = found; break; }
        }
      }
      if (!topic) return;

      const timeline = channelTimelines['main'] || [];

      // Send User prompt in chat
      timeline.push({
        id: 'user_t_' + Date.now(),
        isUser: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: currentLang === 'zh' ? \`探讨话题：\${topic.tag}\` : \`Topic: \${topic.tag}\`
      });
      renderChatStream();

      // Sequential reply from members
      topic.replies.forEach((rep, i) => {
        setTimeout(() => {
          showTyping(rep.senderId);
          setTimeout(() => {
            hideTyping();
            timeline.push({
              id: 'rep_' + rep.senderId + '_' + Date.now() + '_' + i,
              senderId: rep.senderId,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text_zh: rep.text_zh,
              text_en: rep.text_zh
            });
            renderChatStream();
            const viewChat = document.getElementById('view-chat');
            if (viewChat) viewChat.scrollTop = viewChat.scrollHeight;
          }, 600);
        }, i * 1100);
      });
    }`;

const startTCT = widgetHtml.indexOf('function triggerClubTopic(topicId) {');
const endTCT = widgetHtml.indexOf('function updateClock() {');
if (startTCT !== -1 && endTCT !== -1) {
  widgetHtml = widgetHtml.slice(0, startTCT) + newTriggerClubTopic + '\n\n    ' + widgetHtml.slice(endTCT);
}

// E. Update clubChannels definition in HTML
const startIndex = widgetHtml.indexOf('const clubChannels = [');
const endIndex = widgetHtml.indexOf('const channelTimelines = {');
if (startIndex !== -1 && endIndex !== -1) {
  const newChannelsCode = `const clubChannels = ${JSON.stringify(chatData.channels, null, 2)};\n\n    `;
  widgetHtml = widgetHtml.slice(0, startIndex) + newChannelsCode + widgetHtml.slice(endIndex);
}

fs.writeFileSync(widgetPath, widgetHtml, 'utf-8');
console.log('Successfully updated public/widgets/silicon-class-group.html for Big Group unification!');
