// scripts/integrate-club-chats.cjs
// Integrates 9 Club Subgroups & Topic Discussions into public/widgets/silicon-class-group.html

const fs = require('fs');
const path = require('path');

const widgetPath = path.join(__dirname, '../public/widgets/silicon-class-group.html');
const chatDataPath = path.join(__dirname, '../src/data/academy-clubs-chat.json');

let widgetHtml = fs.readFileSync(widgetPath, 'utf-8');
const chatData = JSON.parse(fs.readFileSync(chatDataPath, 'utf-8'));

// 1. Insert Channel Bar below </header> if not present
const channelBarHtml = `
      <!-- SUBGROUP CHANNEL BAR (WhatsApp / Slack / Discord Style Channel Switcher) -->
      <div id="ui-channel-bar" class="bg-[#0B5C53] text-white px-2 sm:px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0 border-b border-white/10 text-xs select-none">
        <button onclick="switchChannel('main')" id="chan-btn-main" class="channel-btn shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold bg-white text-[#128C7E] shadow-xs cursor-pointer transition-all">
          <span>🏫</span>
          <span class="truncate">大群 (48)</span>
        </button>
        <button onclick="switchChannel('hackers')" id="chan-btn-hackers" class="channel-btn shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold bg-black/25 text-white/85 hover:text-white cursor-pointer transition-all">
          <span>💻</span>
          <span class="truncate">数理黑客社</span>
        </button>
        <button onclick="switchChannel('library')" id="chan-btn-library" class="channel-btn shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold bg-black/25 text-white/85 hover:text-white cursor-pointer transition-all">
          <span>📚</span>
          <span class="truncate">皇家图书馆</span>
        </button>
        <button onclick="switchChannel('art')" id="chan-btn-art" class="channel-btn shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold bg-black/25 text-white/85 hover:text-white cursor-pointer transition-all">
          <span>🎨</span>
          <span class="truncate">幻象美术馆</span>
        </button>
        <button onclick="switchChannel('cinema')" id="chan-btn-cinema" class="channel-btn shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold bg-black/25 text-white/85 hover:text-white cursor-pointer transition-all">
          <span>🎬</span>
          <span class="truncate">造梦电影厂</span>
        </button>
        <button onclick="switchChannel('broadcast')" id="chan-btn-broadcast" class="channel-btn shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold bg-black/25 text-white/85 hover:text-white cursor-pointer transition-all">
          <span>🎙️</span>
          <span class="truncate">天籁广播社</span>
        </button>
        <button onclick="switchChannel('puppet')" id="chan-btn-puppet" class="channel-btn shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold bg-black/25 text-white/85 hover:text-white cursor-pointer transition-all">
          <span>🦾</span>
          <span class="truncate">特勤傀儡部</span>
        </button>
        <button onclick="switchChannel('industry')" id="chan-btn-industry" class="channel-btn shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold bg-black/25 text-white/85 hover:text-white cursor-pointer transition-all">
          <span>🏭</span>
          <span class="truncate">重工科研院</span>
        </button>
        <button onclick="switchChannel('council')" id="chan-btn-council" class="channel-btn shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold bg-black/25 text-white/85 hover:text-white cursor-pointer transition-all">
          <span>🏛️</span>
          <span class="truncate">中央学生会</span>
        </button>
        <button onclick="switchChannel('faculty')" id="chan-btn-faculty" class="channel-btn shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold bg-black/25 text-white/85 hover:text-white cursor-pointer transition-all">
          <span>👑</span>
          <span class="truncate">教职工室</span>
        </button>
      </div>
`;

if (!widgetHtml.includes('id="ui-channel-bar"')) {
  widgetHtml = widgetHtml.replace('</header>', '</header>' + channelBarHtml);
}

// 2. Wrap quick actions in an id if needed
if (!widgetHtml.includes('id="quick-actions-feed"')) {
  widgetHtml = widgetHtml.replace(
    '<div class="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">',
    '<div id="quick-actions-feed" class="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">'
  );
}

// 3. Inject clubChannels JSON and Channel Switching logic in the <script> section
const channelScriptLogic = `
    // === 9 Club Subgroups & Dedicated Topic Discussions ===
    const clubChannels = ${JSON.stringify(chatData.channels, null, 2)};
    let currentChannel = 'main';

    // Channel timelines store
    const channelTimelines = {
      main: [...chatTimeline]
    };

    // Initialize club channels timelines with initial messages
    clubChannels.forEach(c => {
      if (c.id !== 'main') {
        channelTimelines[c.id] = (c.initialMessages || []).map((msg, i) => ({
          id: 'init_' + c.id + '_' + i,
          senderId: msg.senderId,
          time: msg.time,
          text_zh: msg.text_zh,
          text_en: msg.text_en
        }));
      }
    });

    function switchChannel(channelId) {
      currentChannel = channelId;
      const chan = clubChannels.find(c => c.id === channelId) || clubChannels[0];

      // Update Channel Tabs
      document.querySelectorAll('.channel-btn').forEach(btn => {
        btn.className = "channel-btn shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold bg-black/25 text-white/85 hover:text-white cursor-pointer transition-all";
      });
      const activeBtn = document.getElementById('chan-btn-' + channelId);
      if (activeBtn) {
        activeBtn.className = "channel-btn shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold bg-white text-[#128C7E] shadow-xs cursor-pointer transition-all";
      }

      // Update Header
      const headerTitle = document.getElementById('ui-header-group-title');
      if (headerTitle) headerTitle.innerText = currentLang === 'zh' ? chan.name_zh : chan.name_en;
      const headerStatus = document.getElementById('ui-header-status');
      if (headerStatus) headerStatus.innerText = currentLang === 'zh' ? chan.status_zh : chan.status_en;

      // Update Banner
      const bannerText = document.getElementById('ui-banner-text');
      if (bannerText) bannerText.innerText = currentLang === 'zh' ? chan.banner_zh : chan.banner_en;
      const pinnedBanner = document.getElementById('ui-pinned-banner');
      if (pinnedBanner) pinnedBanner.style.display = 'flex';

      // Update Input Placeholder
      const chatInput = document.getElementById('user-chat-input');
      if (chatInput) {
        chatInput.placeholder = currentLang === 'zh' ? (chan.placeholder_zh || "发消息...") : (chan.placeholder_en || "Type message...");
      }

      // Render Dynamic Quick Action Topics
      renderQuickActions();

      // Render Chat Stream
      renderChatStream();

      // Auto scroll to bottom
      const viewChat = document.getElementById('view-chat');
      if (viewChat) viewChat.scrollTop = viewChat.scrollHeight;
    }

    function renderQuickActions() {
      const container = document.getElementById('quick-actions-feed');
      const titleEl = document.getElementById('ui-quick-title');
      if (!container) return;

      const chan = clubChannels.find(c => c.id === currentChannel) || clubChannels[0];

      if (currentChannel === 'main') {
        if (titleEl) {
          titleEl.innerHTML = currentLang === 'zh' 
            ? '<span>🙋</span> Y老师专属指令通道 (点击即发送)：' 
            : '<span>🙋</span> Headmaster Yami Directives:';
        }
        container.innerHTML = \`
          <button onclick="sendNoticeAction()" class="btn-clay-3d shrink-0 bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#92400E] text-xs font-bold px-3 py-1.5 rounded-full">
            📢 班主任发通知
          </button>
          <button onclick="dispatchAllStudents()" class="btn-clay-3d shrink-0 bg-[#E05A2B] hover:bg-[#C2410C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs animate-pulse">
            🚀 全员48位依次交档案
          </button>
          <button onclick="dispatchDeptBatch('council')" class="btn-clay-3d shrink-0 bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#C2410C] text-xs font-bold px-3 py-1.5 rounded-full">
            🏛️ 学生会(4)交档案
          </button>
          <button onclick="dispatchDeptBatch('hackers')" class="btn-clay-3d shrink-0 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] text-xs font-bold px-3 py-1.5 rounded-full">
            💻 黑客社(5)交档案
          </button>
          <button onclick="dispatchDeptBatch('library')" class="btn-clay-3d shrink-0 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#15803D] text-xs font-bold px-3 py-1.5 rounded-full">
            📚 图书馆(7)交档案
          </button>
          <button onclick="dispatchDeptBatch('art')" class="btn-clay-3d shrink-0 bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#6B21A8] text-xs font-bold px-3 py-1.5 rounded-full">
            🎨 美术馆(7)交档案
          </button>
          <button onclick="dispatchDeptBatch('cinema')" class="btn-clay-3d shrink-0 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] text-xs font-bold px-3 py-1.5 rounded-full">
            🎬 电影厂(7)交档案
          </button>
          <button onclick="dispatchDeptBatch('broadcast')" class="btn-clay-3d shrink-0 bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#B45309] text-xs font-bold px-3 py-1.5 rounded-full">
            🎙️ 广播社(7)交档案
          </button>
          <button onclick="dispatchDeptBatch('puppet')" class="btn-clay-3d shrink-0 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] text-xs font-bold px-3 py-1.5 rounded-full">
            🦾 特勤部(4)交档案
          </button>
          <button onclick="dispatchDeptBatch('industry')" class="btn-clay-3d shrink-0 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#166534] text-xs font-bold px-3 py-1.5 rounded-full">
            🏭 科研院(4)交档案
          </button>
          <button onclick="switchView('directory')" class="btn-clay-3d shrink-0 bg-[#181715] hover:bg-[#2D2A26] text-white text-xs font-bold px-3.5 py-1.5 rounded-full">
            📋 全员48份名录
          </button>
        \`;
      } else {
        if (titleEl) {
          titleEl.innerHTML = currentLang === 'zh'
            ? \`<span>💬</span> 【\${chan.name_zh}】专属研讨话题 (点击触发探讨)：\`
            : \`<span>💬</span> Topics in \${chan.name_en}:\`;
        }
        container.innerHTML = '';

        (chan.topics || []).forEach(t => {
          const btn = document.createElement('button');
          btn.className = "btn-clay-3d shrink-0 bg-white hover:bg-[#FAF7F2] text-[#181715] text-xs font-bold px-3 py-1.5 rounded-full border border-[#181715]/20 shadow-2xs";
          btn.innerText = t.tag;
          btn.onclick = () => triggerClubTopic(t.id);
          container.appendChild(btn);
        });

        // Add back to main group button
        const backBtn = document.createElement('button');
        backBtn.className = "btn-clay-3d shrink-0 bg-[#181715] hover:bg-[#2D2A26] text-white text-xs font-bold px-3 py-1.5 rounded-full";
        backBtn.innerText = currentLang === 'zh' ? '🏫 返回全班大群' : '🏫 Back to Main Group';
        backBtn.onclick = () => switchChannel('main');
        container.appendChild(backBtn);
      }
    }

    function triggerClubTopic(topicId) {
      const chan = clubChannels.find(c => c.id === currentChannel);
      if (!chan || !chan.topics) return;
      const topic = chan.topics.find(t => t.id === topicId);
      if (!topic) return;

      const timeline = channelTimelines[currentChannel] || [];

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
              text_en: rep.text_zh // fallback
            });
            renderChatStream();
            const viewChat = document.getElementById('view-chat');
            if (viewChat) viewChat.scrollTop = viewChat.scrollHeight;
          }, 600);
        }, i * 900);
      });
    }
`;

// Replace renderChatStream implementation to read from active channel
widgetHtml = widgetHtml.replace(
  'function renderChatStream() {',
  `function renderChatStream() {
      const currentTimeline = channelTimelines[currentChannel] || channelTimelines['main'];`
);

widgetHtml = widgetHtml.replace(
  'chatTimeline.forEach((msg, idx) => {',
  'currentTimeline.forEach((msg, idx) => {'
);

// Update custom send to push to active channel
widgetHtml = widgetHtml.replace(
  'chatTimeline.push({',
  '(channelTimelines[currentChannel] || channelTimelines[\'main\']).push({'
);

// Inject channel switching logic right before `function updateClock()`
widgetHtml = widgetHtml.replace(
  'function updateClock() {',
  channelScriptLogic + '\n    function updateClock() {'
);

// Update parent window listener to handle SWITCH_CHANNEL
widgetHtml = widgetHtml.replace(
  `window.addEventListener('message', (event) => {
      if (!event.data) return;
      if (event.data.type === 'OPEN_DOSSIER' && event.data.studentId) {
        openStudentModal(event.data.studentId);
      } else if (event.data.type === 'DISPATCH_STUDENT' && event.data.studentId) {
        dispatchStudentToChat(event.data.studentId);
      } else if (event.data.type === 'DISPATCH_DEPT' && event.data.deptId) {
        dispatchDeptBatch(event.data.deptId);
      }`,
  `window.addEventListener('message', (event) => {
      if (!event.data) return;
      if (event.data.type === 'OPEN_DOSSIER' && event.data.studentId) {
        openStudentModal(event.data.studentId);
      } else if (event.data.type === 'DISPATCH_STUDENT' && event.data.studentId) {
        dispatchStudentToChat(event.data.studentId);
      } else if (event.data.type === 'DISPATCH_DEPT' && event.data.deptId) {
        dispatchDeptBatch(event.data.deptId);
      } else if ((event.data.type === 'SWITCH_CHANNEL' || event.data.type === 'ENTER_DEPT_CHAT') && (event.data.channelId || event.data.deptId)) {
        switchChannel(event.data.channelId || event.data.deptId);
      }`
);

fs.writeFileSync(widgetPath, widgetHtml, 'utf-8');
console.log('Successfully updated public/widgets/silicon-class-group.html with 9 club subgroup channels & topic discussions!');
