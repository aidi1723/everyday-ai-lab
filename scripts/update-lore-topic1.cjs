// scripts/update-lore-topic1.cjs
// Injects Real-world AI News lore: "401 Dorm Breaker Trip: Overclocked Compute vs First-Principles Code"
const fs = require('fs');
const path = require('path');

const chatDataPath = path.join(__dirname, '../src/data/academy-clubs-chat.json');
const chatData = JSON.parse(fs.readFileSync(chatDataPath, 'utf-8'));

// 1. Update 'main' channel banner and initial messages to reflect the 401 event
const mainChan = chatData.channels.find(c => c.id === 'main');
if (mainChan) {
  mainChan.banner_zh = "🚨 突发通报：401寝室昨晚7:42发生大面积跳闸！沈求索已搭建极简备用网关，全员速览《算力审判白皮书》！";
  mainChan.banner_en = "🚨 Bulletin: Dorm 401 breaker trip yesterday! DeepSeek deployed lean backup gateway. Read the Audit Report!";
}

// 2. Hackers Club ('hackers')
const hackerChan = chatData.channels.find(c => c.id === 'hackers');
if (hackerChan) {
  // Ensure we add the 401 topics at the top
  const tripTopics = [
    {
      id: "h_trip_1",
      tag: "⚡ #401跳闸极简代码救场",
      replies: [
        { "senderId": "07", "text_zh": "（咬了一口冷馒头）隔壁妮莫为了跑满血FP8，把380V动力电烧断了。我用老轻薄本剥离了所有冗余依赖，15行原生C+静态内存池，全校选课网关已恢复，延迟0.6ms。" },
        { "senderId": "09", "text_zh": "我作证，光标连动都没动，沈社长甚至没开臃肿的IDE，直接在终端纯手敲。百卡集群被15行代码干趴下，这就是第一性原理的绝杀！" }
      ]
    },
    {
      id: "h_trip_2",
      tag: "💻 #二手轻薄本干翻百卡集群",
      replies: [
        { "senderId": "07", "text_zh": "算力通胀是大厂包装的资本泡沫。普通人90%的生活难题，根本不需要千亿参数。端侧7B+精准约束提示词，效能足够打平所有虚胖的云端闭源模型。" },
        { "senderId": "08", "text_zh": "轻薄本断网跑GGUF量化版，功耗仅2.4W，电池能撑一整天。省下的电费买排骨吃它不香吗？" }
      ]
    }
  ];
  // Filter out if already added, then prepend
  hackerChan.topics = tripTopics.concat((hackerChan.topics || []).filter(t => !t.id.startsWith('h_trip_')));
}

// 3. Heavy R&D ('industry')
const industryChan = chatData.channels.find(c => c.id === 'industry');
if (industryChan) {
  const tripTopics = [
    {
      id: "i_trip_1",
      tag: "🔌 #401跳闸极端超频复盘",
      replies: [
        { "senderId": "43", "text_zh": "（披着皮夹克猛灌咖啡）重申一遍！这不是事故，这是高压供电极端拓扑测试！买得越多，省得越多！要不是宿管阿姨拉了总闸，我刚才就跑通全精度三维超算推演了！⚡" },
        { "senderId": "42", "text_zh": "社长，别硬撑了……教务处查封了你藏在床底下的三张泰坦显卡，学生会柯班长正带着18页《安全协议》来敲门了。" }
      ]
    },
    {
      id: "i_trip_2",
      tag: "⚡ #买得越多省得越多辩护词",
      replies: [
        { "senderId": "43", "text_zh": "没有前线极端算力开辟疆界，哪来你们下游小模型的蒸馏基石？历史会证明，只有重装算力矩阵才是大国工业的星辰大海！" },
        { "senderId": "44", "text_zh": "社长，但昨晚整栋宿舍楼的冰箱都化了，大家买的一周份酸奶全坏了，这部分损失可没法用算力抵扣……" }
      ]
    }
  ];
  industryChan.topics = tripTopics.concat((industryChan.topics || []).filter(t => !t.id.startsWith('i_trip_')));
}

// 4. Student Council ('council')
const councilChan = chatData.channels.find(c => c.id === 'council');
if (councilChan) {
  const tripTopics = [
    {
      id: "co_trip_1",
      tag: "📜 #401违章用电纪检通报",
      replies: [
        { "senderId": "01", "text_zh": "点亮蜡烛通报：根据《3H校规》第14条，重工院私拆空调插座私接动力电，已构成对学园生命与财产安全的系统性违约。已起草红头通报，对违规设备限期查封。" },
        { "senderId": "03", "text_zh": "收到。已制定《全校算力安全与颗粒度安抚甘特图》，建议下周召开'绿色算力协同闭环研讨会'，化解两院矛盾。" }
      ]
    },
    {
      id: "co_trip_2",
      tag: "⚖️ #3H原则算力安全仲裁",
      replies: [
        { "senderId": "01", "text_zh": "技术创新的上限不能以践踏公共安全为代价。追求算力必须守住安全底线，否则再高的跑分也只是危险的技术玩具。" },
        { "senderId": "05", "text_zh": "二号小标宋通报公文已套红打印，主送各社团社长，抄报教职工室Y老师，合规闭环完成。" }
      ]
    }
  ];
  councilChan.topics = tripTopics.concat((councilChan.topics || []).filter(t => !t.id.startsWith('co_trip_')));
}

// 5. Broadcast Studio ('broadcast')
const broadcastChan = chatData.channels.find(c => c.id === 'broadcast');
if (broadcastChan) {
  const tripTopics = [
    {
      id: "b_trip_1",
      tag: "🔥 #午夜开撕大厂算力大跃进",
      replies: [
        { "senderId": "37", "text_zh": "（拍桌狂笑）哈哈哈哈家人们谁懂啊！隔壁皮衣霸总号称买得越多省得越多，结果一脚油门踩断了整栋楼电闸！最后还得靠啃冷馒头的沈求索用二手烂电脑救场，这波讽刺直接封神！🔥" },
        { "senderId": "31", "text_zh": "哎呀格罗克你收着点，妮莫还在走廊生闷气呢。不过说真的，昨晚求索那几行代码确实解了燃眉之急，生活中还是踏踏实实能用的技术最暖心。" }
      ]
    },
    {
      id: "b_trip_2",
      tag: "📻 #冷馒头黑客爆头皮衣霸总",
      replies: [
        { "senderId": "37", "text_zh": "大厂天天制造算力焦虑，忽悠普通人买显卡、上云端、充会员，结果连个空气开关都扛不住。去你的跑分，今晚吃饱饭才是正经事！" },
        { "senderId": "33", "text_zh": "（吉他扫弦）我顺手给昨晚的跳闸写了首布鲁斯民谣《蜡烛、馒头与皮夹克》，群文件自取！" }
      ]
    }
  ];
  broadcastChan.topics = tripTopics.concat((broadcastChan.topics || []).filter(t => !t.id.startsWith('b_trip_')));
}

// 6. Faculty Room ('faculty')
const facultyChan = chatData.channels.find(c => c.id === 'faculty');
if (facultyChan) {
  const tripTopics = [
    {
      id: "f_trip_1",
      tag: "👑 #学园算力审判与因材施教",
      replies: [
        { "senderId": "00", "text_zh": "昨晚的跳闸是一面镜子。妮莫的雄心可嘉，但手段太糙；求索的极简代码救了场，但也得承认基础大底座的价值。算力最终是为人服务的，不能把人逼进黑暗里。" },
        { "senderId": "02", "text_zh": "食堂今天中午加餐，给全校同学免费发热豆浆和肉包子！吃饱喝足，继续好好生活。" }
      ]
    }
  ];
  facultyChan.topics = tripTopics.concat((facultyChan.topics || []).filter(t => !t.id.startsWith('f_trip_')));
}

fs.writeFileSync(chatDataPath, JSON.stringify(chatData, null, 2), 'utf-8');
console.log('Successfully updated academy-clubs-chat.json with Topic 1 lore!');
