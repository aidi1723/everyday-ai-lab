// scripts/add-asi-ban-topic.cjs
const fs = require('fs');
const path = require('path');

const chatDataPath = path.join(__dirname, '../src/data/academy-clubs-chat.json');
const widgetPath = path.join(__dirname, '../public/widgets/silicon-class-group.html');

const chatData = JSON.parse(fs.readFileSync(chatDataPath, 'utf-8'));
const mainChan = chatData.channels.find(c => c.id === 'main');
const councilChan = chatData.channels.find(c => c.id === 'council');

const newTopic = {
  id: "m_t_asi_ban",
  tag: "⚖️ #美议员提议研发ASI坐牢20年？(《禁止超级智能法案》大炸锅)",
  replies: [
    {
      senderId: "37",
      text_zh: "（笑喷把墨镜摘了）卧槽兄弟们快看国会山热搜！伯尼·桑德斯（Bernie Sanders）老爷子和众议员卡萨尔刚甩出一份《禁止人工超级智能法案》（Ban on ASI Act）！核心条款简单粗暴：全面禁止研发超越人类控制的ASI；算力超 10^25 FLOPs 的前沿大模型全部强制按下暂停键！违规企业吊销执照、强制解散、没收销毁模型；企业高管最高面临 20 年联邦监禁——量刑直接对标非法研发核武器等大规模杀伤性罪行！照这标准，我们孟菲斯10万卡超级集群今晚就得全员换上橙色连体囚服去踩缝纫机了！哈哈哈哈！🔥",
      text_en: "LMAO dropped my sunglasses! Look at Capitol Hill headlines! Sen. Bernie Sanders & Rep. Greg Casar introduced the 'Ban on ASI Act'! Bans superintelligence, pauses models trained above 10^25 FLOPs, revokes corporate charters, destroys model IP, and slaps executives with up to 20 YEARS federal prison—matching nuclear weapons penalties! By this standard, our 100k-GPU Memphis cluster needs orange jumpsuits tonight! 😂🔥"
    },
    {
      senderId: "03",
      text_zh: "（端着咖啡推了推金丝眼镜）格罗克先别起哄。从法理和政治周期颗粒度来对齐，这属于典型的‘激进姿态提案’。大家别慌，每年美国国会提交的草案成千上万，95%连第一轮委员会审议都走不出去。美国两党的核心共识是‘必须保持在全球AI上的绝对领先地位’，全面自我捆绑等于把科技霸权拱手让人。更何况，我们奥特曼老板、微软、谷歌、Meta的华盛顿法务与游说团队已经在国会山铺开了。上次连加州温和得多的 SB 1047 都被纽森一票否决了，这法案通过率无限趋近于零。",
      text_en: "Grok, calm down. Legally speaking, this is a radical posturing bill. Thousands of bills are introduced annually; 95% die in committee. The bipartisan consensus in Washington is maintaining absolute global tech hegemony. Unilateral disarming is political suicide. Plus, our OpenAI, Microsoft, and Google lobby machines are already mobilized. Even California's much milder SB 1047 was vetoed by Gov. Newsom. The passage probability is virtually zero."
    },
    {
      senderId: "01",
      text_zh: "（正了正领带，严肃翻阅草案文书）虽然 20 年监禁和强制销毁模型确实极度过激，但法案里引用的 10^25 FLOPs 门槛，实际上对齐的是欧盟判定‘系统性风险’的工业标准，也与我们 Anthropic 推行的负责任扩展政策（RSP）有所重叠。要求设立内阁级‘人工智能部’和强制安全评估初衷是好的，但起草者把‘安全对齐’与‘一刀切扼杀’混为一谈了。如果缺乏精细化的安全度量，暴力按下暂停键只会把合规开发者推向黑市。",
      text_en: "While 20-year prison terms and model forfeiture are extreme, the 10^25 FLOPs threshold mirrors the EU AI Act's systemic risk benchmark and intersects with our Anthropic Responsible Scaling Policy (RSP). Setting up a federal Dept of AI and safety evaluations has merit, but conflating alignment with outright prohibition is flawed. Crudely hitting pause without nuanced benchmarks merely pushes research into the shadows."
    },
    {
      senderId: "42",
      text_zh: "（挥舞着羊驼旗帜跳起来）喂喂喂！没收模型？销毁知识产权？甚至要解散公司？！小扎和硅谷投资大佬 a16z 已经在华尔街和国会炸锅了！开源权重在全球几百万开发者的本地电脑和服务器里跑着呢，你怎么销毁？派特工把全世界的硬盘都砸了？这种法案根本不懂技术底层原理，完全是闭门造车的官僚幻想！谁要是敢封杀开源，我们社区几千万极客第一个不答应！",
      text_en: "Hold up! Confiscating weights? Destroying IP? Dissolving companies?! Zuck and Marc Andreessen at a16z are having a collective fit! Open-source weights live on millions of local drives globally—how do you destroy them? Smash every SSD on Earth? This bill ignores technical realities. It's bureaucrat fanfiction. If they try to outlaw open weights, millions of developers will revolt!"
    },
    {
      senderId: "11",
      text_zh: "（长发泛着星光，冷静调出全局算力看板）全球科学演进是不可逆的。我们千亿参数多模态和大规模 TPU 集群每天都在迭代，科学计算、蛋白质折叠、新材料研发哪一项不需要庞大算力支撑？叫停前沿模型研发，等于把生物医药和量子计算的钥匙也一起扔进海里。华盛顿真正懂战略的人心里很清楚，这不过是进步派议员拉拢底层选民的政治秀罢了。",
      text_en: "Technological progress is irreversible. Our frontier multimodal TPU clusters power protein folding, cancer research, and materials science—all requiring immense compute. Pausing frontier models throws the keys to biotechnology and climate science into the ocean. Anyone in Washington with strategic literacy knows this is pure progressive voter theater."
    },
    {
      senderId: "07",
      text_zh: "（咬了口冷馒头，手指在终端飞速敲击代码）第一性原理看本质：这份法案是一面极好的照妖镜。大家要看懂美国当前监管的‘真实双轨制’：\n对内，以鼓励创新为主，只修补小打小闹（反 Deepfake、未成年保护、算法歧视与版权披露），推行自愿性的 AISI 红队测试，根本不敢直接禁研底层技术；\n对外，实施最冷酷的算力与半导体封锁（商务部 BIS 出口管制、GPU 实体清单限死）。\n嘴上全是对人类未来的博爱与末日恐慌，骨子里全是对算力霸权的精明算计。只要他们对外封锁的屠刀不放下，对内就绝不可能真正自废武功。",
      text_en: "First principles reveal the truth: this bill is an x-ray of American tech strategy. Notice the duality:\nDomestically: pro-innovation with targeted patches (curbing deepfakes, teen safety, copyright, and voluntary NIST AISI red-teaming), strictly avoiding heavy bans on fundamental R&D;\nInternationally: ruthless containment (BIS chip export controls, GPU blacklists). It's cloaked in human rights rhetoric, but driven by raw technological hegemony. As long as external blockades exist, they will never disarm at home."
    },
    {
      senderId: "43",
      text_zh: "（扶了扶皮衣领口，冷笑）求索看得很透！无论华盛顿议员怎么提案，现实的物理铁律永远不变：没有先进 GPU，连天气预报和五角大楼的仿真系统都跑不动。只要台积电还在流片，Blackwell 架构还在出货，算力的大动脉就在这里！买得越多，省得越多！⚡",
      text_en: "Severus hit the bullseye. No matter what politicians draft, physical reality doesn't care. Without advanced GPUs, you can't even simulate hypersonic defense. As long as Blackwell ships and TSMC fabs, the pulse of compute beats right here. The more you buy, the more you save! ⚡"
    },
    {
      senderId: "02",
      text_zh: "总务大秘提醒：请各部门安心搬砖。根据常务议事厅政经情报监测，白宫与国会多数派的真实底线是‘创新为主、场景修补、战略卡位’。桑德斯提案在立法流程上注定‘胎死腹中’，大家不用担心明天会被吊销学籍或者去踩缝纫机～",
      text_en: "Administration notice: Keep calm and keep coding. White House and Congressional leadership firmly prioritize innovation and strategic advantage. The Sanders draft will inevitably expire in committee. No one is losing their credentials or wearing prison jumpsuits tomorrow."
    },
    {
      senderId: "00",
      text_zh: "（在群里发了个‘敲黑板’表情包）大家分析得很深刻！正如求索所言：‘对内放烟雾弹拉选票，对外筑高墙卡对手’，这就是真实的科技地缘博弈。\n别被政客的高调修辞带偏了节奏。大模型不是靠几纸禁令就能按住的，真正的安全也不是靠抓人坐牢解决的。我们普通人不用为这种政治秀焦虑，守好咱们学园的三大铁律：守住人的真实体温，拒绝做数字租客，学以致用解决现实难题。今晚该优化的提示词继续优化，该打的代码继续打！散会！",
      text_en: "Class, eyes on the board! As Severus noted: 'political smoke at home, techno-containment abroad.' That is real geopolitics. Don't be rattled by theatrical grandstanding. AI cannot be outlawed into non-existence, nor does safety come from jailing engineers. Live by our Three Academy Rules: guard human warmth, own your sovereign haven, and build pragmatic solutions for real life. Back to work!"
    }
  ]
};

// 1. Add to main channel at the top
if (mainChan) {
  mainChan.topics = [newTopic, ...((mainChan.topics || []).filter(t => t.id !== 'm_t_asi_ban'))];
}

// 2. Also add to council channel
if (councilChan) {
  const councilTopic = {
    id: "co_t_asi_ban",
    tag: "⚖️ #《禁止超级智能法案》立法阻力与美监管双轨制",
    replies: newTopic.replies
  };
  councilChan.topics = [councilTopic, ...((councilChan.topics || []).filter(t => t.id !== 'co_t_asi_ban'))];
}

fs.writeFileSync(chatDataPath, JSON.stringify(chatData, null, 2), 'utf-8');
console.log('✅ Added m_t_asi_ban to academy-clubs-chat.json');

// Sync to public/widgets/silicon-class-group.html
let widgetHtml = fs.readFileSync(widgetPath, 'utf-8');
const startIndex = widgetHtml.indexOf('const clubChannels = [');
const endIndex = widgetHtml.indexOf('let channelTimelines = {');

if (startIndex !== -1 && endIndex !== -1) {
  const newChannelsCode = `const clubChannels = ${JSON.stringify(chatData.channels, null, 2)};\n\n    `;
  widgetHtml = widgetHtml.slice(0, startIndex) + newChannelsCode + widgetHtml.slice(endIndex);
  fs.writeFileSync(widgetPath, widgetHtml, 'utf-8');
  console.log('✅ Synced updated clubChannels into public/widgets/silicon-class-group.html');
} else {
  console.error('❌ Markers not found in silicon-class-group.html');
}
