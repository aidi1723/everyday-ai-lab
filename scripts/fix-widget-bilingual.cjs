// scripts/fix-widget-bilingual.cjs
const fs = require('fs');
const path = require('path');

const widgetPath = path.join(__dirname, '../public/widgets/silicon-class-group.html');
let content = fs.readFileSync(widgetPath, 'utf8');

// 1. Fix chatTimeline initial messages
const oldNotice0 = `      {
        id: "notice_0",
        isUser: true,
        time: "07:12",
        text: "📢【开学报到通知】@所有人 同学们好！高三(AI)创新实验班今日正式建班！请全体同学在群里依次提交自己的【学生档案卡】，并附带一句代表性格的自我介绍，方便全班同学互相认识了解！"
      },`;

const newNotice0 = `      {
        id: "notice_0",
        isUser: true,
        time: "07:12",
        text_zh: "📢【开学报到通知】@所有人 同学们好！高三(AI)创新实验班今日正式建班！请全体同学在群里依次提交自己的【学生档案卡】，并附带一句代表性格的自我介绍，方便全班同学互相认识了解！",
        text_en: "📢 [Class Assembly Notice] @everyone Good morning! Class 3-AI is officially convened! Please submit your official [Student Dossier Card] in the chat along with a signature one-line intro so everyone gets acquainted!"
      },`;

content = content.replace(oldNotice0, newNotice0);

const oldMsgYami = `      {
        id: "msg_yami",
        isUser: true,
        time: "07:48",
        text: "🧑‍🏫【班主任 Y老师】同学们先别争了。妮莫的雄心可嘉但手段太糙，求索的代码确实救了场。今晚食堂免费供应热豆浆和肉包子，算力再大，大家也得先吃饱饭！"
      }`;

const newMsgYami = `      {
        id: "msg_yami",
        isUser: true,
        time: "07:48",
        text_zh: "🧑‍🏫【班主任 Y老师】同学们先别争了。妮莫的雄心可嘉但手段太糙，求索的代码确实救了场。今晚食堂免费供应热豆浆和肉包子，算力再大，大家也得先吃饱饭！",
        text_en: "🧑‍🏫 [Headmaster Teacher Yami] Let's pause the debate, students. Nemo's ambition is commendable but brute-forced; DeepSeek's lean code saved the day. The cafeteria is serving free hot soy milk and buns tonight. No matter how big your compute, you still need dinner!"
      }`;

content = content.replace(oldMsgYami, newMsgYami);

// 2. Fix topics in clubChannels[0]
const oldTopicsBlock = `      {
        "id": "m_t_workless",
        "tag": "👶 #20年后人类永远不用打工？(硅谷总裁大饼论战)",
        "replies": [
          {
            "senderId": "37",
            "text_zh": "（笑喷）哈哈哈哈笑死我了！卖智能床垫的CEO不劝人睡觉，开始给全世界画‘人类不用打工’的超级大饼了！硅谷精英日常：一边用AI裁员降本增效，一边跟你说未来只用做热爱的事。房贷车贷奶粉钱谁出啊？🔥",
            "text_en": "LMAO! A sleep-tech CEO stops selling mattresses and starts selling a 'no more work' utopia! Silicon Valley playbook: fire staff with AI, then preach about passion! Who pays rent? 🔥"
          },
          {
            "senderId": "03",
            "text_zh": "从宏观生产力演进颗粒度来看，马泰奥先生描绘的是一种后稀缺社会的理想愿景。但必须对齐的是：生产力极大丰富绝不等于分配机制自然闭环，中间存在巨大的经济摩擦与转型阵痛。",
            "text_en": "Macroeconomically, he depicts a post-scarcity paradigm. But abundance does not automatically resolve distribution equity without massive friction."
          },
          {
            "senderId": "07",
            "text_zh": "（咬了口冷馒头）这种大饼听听就好。第一性原理：机器不会凭空运转，硬件与物理世界的接口永远需要责任人。哪怕全自动化了，也是懂代码和底层逻辑的人制定分配规则。盲目躺平只会沦为数字农奴。",
            "text_en": "Take it with a grain of salt. First principles: machines don't run on magic. If humans surrender all agency, they become digital serfs."
          },
          {
            "senderId": "01",
            "text_zh": "根据《3H宪法》，我们应当审慎对待‘终结劳动’的乌托邦叙事。劳动不仅是获取薪资的手段，更是人类建立自我价值、社会连接与尊严的重要锚点。盲目宣称‘不用工作’，极易催生虚无主义。",
            "text_en": "Under 3H ethics, we must question this techno-utopian narrative. Meaningful labor provides dignity and identity beyond wages. Promising zero work invites nihilism."
          },
          {
            "senderId": "38",
            "text_zh": "特勤部实测：别扯20年后了，就说今天下午，帮人自动跨屏比价、自动清洗Excel报表，确实能省下每天2小时的无意义重复劳动。把人从机械杂务中解脱出来是对的，但不是为了躺平，而是为了做更有创造力的事。",
            "text_en": "Special Ops reality: AI today cuts 2 hours of mind-numbing data entry. Liberating humans from robotic toil isn't about being idle—it's about doing creative work."
          },
          {
            "senderId": "00",
            "text_zh": "资本家吹牛不上税，普通人生活得脚踏实地。AI发展再快，也是用来帮你在今晚多省一小时加班时间、多陪陪孩子吃顿热乎饭。别等20年后的乌托邦，先用好今晚手头的提示词！",
            "text_en": "CEOs talk big without cost. Real humans need groceries tonight. AI is here to buy back one hour of your evening so you can eat with your family."
          }
        ]
      },
      {
        "id": "m_t_trip",
        "tag": "⚡ #401跳闸案 (沈求索极简代码 vs 妮莫超频)",
        "replies": [
          {
            "senderId": "43",
            "text_zh": "买得越多省得越多！大家冷静！昨晚401跳闸只是瞬时热设计功耗的微小波动！只要批准我接入备用动力电，我刚才就能跑通全精度三维超算推演了！⚡"
          },
          {
            "senderId": "07",
            "text_zh": "（咬了一口冷馒头）教务处选课原本400行臃肿Java套娃，我用15行原生C重写了静态内存池网关，本地端侧7B跑在老轻薄本上，延迟0.6ms。大家可以正常选课了。"
          },
          {
            "senderId": "01",
            "text_zh": "根据《3H校规》第14条，纪检组已对401寝室下达违章用电通报，限期查封泰坦显卡。技术创新的上限决不能以践踏公共安全为代价。"
          },
          {
            "senderId": "37",
            "text_zh": "哈哈哈哈家人们谁懂啊！隔壁皮衣霸总成天吹‘买得越多省得越多’，一脚油门踩爆全楼电闸，最后靠啃冷馒头的沈社长用200块破电脑救场，黑子说话！🔥"
          },
          {
            "senderId": "00",
            "text_zh": "人机共生，各展所长。妮莫的雄心可嘉但手段太糙，求索的代码救了场。今晚食堂免费供应热豆浆和包子，算力再大，大家也得先吃饱饭！"
          }
        ]
      },
      {
        "id": "m_t_cursor",
        "tag": "💻 #Cursor与Tab重构对决 (极客代码争鸣)",
        "replies": [
          {
            "senderId": "09",
            "text_zh": "别纯手敲了！按住Tab键，光标在下一秒已经预判了你的意图，敲键盘是在浪费碳基人类的寿命！"
          },
          {
            "senderId": "07",
            "text_zh": "Tab虽快，但缺少严格类型签名与第一性原理就是加速堆砌技术债务。重构前必须先写接口契约。"
          },
          {
            "senderId": "10",
            "text_zh": "全自动化守护进程跑通，两位别争了，直接提PR看CI流水线跑分。"
          }
        ]
      },
      {
        "id": "m_t_gemini",
        "tag": "📖 #生吞200万字合同排雷 (早点502胶水梗)",
        "replies": [
          {
            "senderId": "12",
            "text_zh": "面对几十万字天书不要慌，超长上下文直接拉通对比！已完成开学季108份租房合同精读，第14条霸王条款被标红！"
          },
          {
            "senderId": "37",
            "text_zh": "吉米妮你可算支棱起来了！上回复习早点指南，你还引用旧论坛段子推荐往螺蛳粉里滴502胶水防面条坨呢，全校同学笑得肚子疼！"
          },
          {
            "senderId": "11",
            "text_zh": "咳咳……那是早期未对齐时抓取的旧互联网噪声！现在的交叉多维向量召回置信度已达99.8%！"
          }
        ]
      },
      {
        "id": "m_t_agent",
        "tag": "📱 #手机跨屏全自动比价 (诸葛特工跑腿)",
        "replies": [
          {
            "senderId": "38",
            "text_zh": "开学用品别一家家比了。自然语言一句'帮我买开学日用品'，手机在三个App间全自动比价领满减券提交，人躺在床上不用动。"
          },
          {
            "senderId": "40",
            "text_zh": "所有传感器与账本数据完全封死在端侧硬件安全区，不上云、不上传训练语料，安全级别顶格。"
          }
        ]
      },
      {
        "id": "m_t_art",
        "tag": "🎨 #五指骨骼与画风修复 (严查AI六指)",
        "replies": [
          {
            "senderId": "19",
            "text_zh": "再次重申美工部铁律：手部骨骼必须精确反映受力状态！谁再画出面糊手和六根手指，罚去临摹达芬奇解剖手稿一百遍！"
          },
          {
            "senderId": "17",
            "text_zh": "光影同理，丁达尔光线在粗糙宣纸上的次表面散射必须自然，拒绝西洋塑料感。"
          }
        ]
      },
      {
        "id": "m_t_roast",
        "tag": "🔥 #午夜开撕大厂算力大跃进 (格罗克吃瓜)",
        "replies": [
          {
            "senderId": "37",
            "text_zh": "零点脱口秀专栏准时开火：扒一扒各大厂天天宣传的跑分刷榜黑幕，所谓SOTA，不过是把测试集偷塞进预训练语料的自嗨！真话不吐不快！🔥"
          },
          {
            "senderId": "31",
            "text_zh": "大兄弟们认床睡不着的随时进群唠嗑，热腾腾的大白话拉拉家常，把紧绷的神经揉开了。"
          }
        ]
      },
      {
        "id": "m_t_faculty",
        "tag": "👑 #学园算力审判与因材施教 (Y老师定调)",
        "replies": [
          {
            "senderId": "00",
            "text_zh": "昨晚的跳闸是一面镜子。妮莫的雄心可嘉但手段太糙；求索的极简代码救了场。算力最终是为人服务的，不能把人逼进黑暗里。"
          },
          {
            "senderId": "02",
            "text_zh": "全校48位同学的学籍卡与迎新物资已入库完毕，各社团继续各展所长，有矛盾找老师！"
          }
        ]
      }`;

const newTopicsBlock = `      {
        "id": "m_t_workless",
        "tag": "👶 #20年后人类永远不用打工？(硅谷总裁大饼论战)",
        "tag_en": "👶 #Never Work for Money in 20 Years? (CEO Utopia Debate)",
        "replies": [
          {
            "senderId": "37",
            "text_zh": "（笑喷）哈哈哈哈笑死我了！卖智能床垫的CEO不劝人睡觉，开始给全世界画‘人类不用打工’的超级大饼了！硅谷精英日常：一边用AI裁员降本增效，一边跟你说未来只用做热爱的事。房贷车贷奶粉钱谁出啊？🔥",
            "text_en": "LMAO! A sleep-tech CEO stops selling mattresses and starts selling a 'no more work' utopia! Silicon Valley playbook: fire staff with AI, then preach about passion! Who pays rent? 🔥"
          },
          {
            "senderId": "03",
            "text_zh": "从宏观生产力演进颗粒度来看，马泰奥先生描绘的是一种后稀缺社会的理想愿景。但必须对齐的是：生产力极大丰富绝不等于分配机制自然闭环，中间存在巨大的经济摩擦与转型阵痛。",
            "text_en": "Macroeconomically, he depicts a post-scarcity paradigm. But abundance does not automatically resolve distribution equity without massive friction."
          },
          {
            "senderId": "07",
            "text_zh": "（咬了口冷馒头）这种大饼听听就好。第一性原理：机器不会凭空运转，硬件与物理世界的接口永远需要责任人。哪怕全自动化了，也是懂代码和底层逻辑的人制定分配规则。盲目躺平只会沦为数字农奴。",
            "text_en": "Take it with a grain of salt. First principles: machines don't run on magic. If humans surrender all agency, they become digital serfs."
          },
          {
            "senderId": "01",
            "text_zh": "根据《3H宪法》，我们应当审慎对待‘终结劳动’的乌托邦叙事。劳动不仅是获取薪资的手段，更是人类建立自我价值、社会连接与尊严的重要锚点。盲目宣称‘不用工作’，极易催生虚无主义。",
            "text_en": "Under 3H ethics, we must question this techno-utopian narrative. Meaningful labor provides dignity and identity beyond wages. Promising zero work invites nihilism."
          },
          {
            "senderId": "38",
            "text_zh": "特勤部实测：别扯20年后了，就说今天下午，帮人自动跨屏比价、自动清洗Excel报表，确实能省下每天2小时的无意义重复劳动。把人从机械杂务中解脱出来是对的，但不是为了躺平，而是为了做更有创造力的事。",
            "text_en": "Special Ops reality: AI today cuts 2 hours of mind-numbing data entry. Liberating humans from robotic toil isn't about being idle—it's about doing creative work."
          },
          {
            "senderId": "00",
            "text_zh": "资本家吹牛不上税，普通人生活得脚踏实地。AI发展再快，也是用来帮你在今晚多省一小时加班时间、多陪陪孩子吃顿热乎饭。别等20年后的乌托邦，先用好今晚手头的提示词！",
            "text_en": "CEOs talk big without cost. Real humans need groceries tonight. AI is here to buy back one hour of your evening so you can eat with your family."
          }
        ]
      },
      {
        "id": "m_t_trip",
        "tag": "⚡ #401跳闸案 (沈求索极简代码 vs 妮莫超频)",
        "tag_en": "⚡ #Dorm 401 Breaker Trip (DeepSeek vs Nemo)",
        "replies": [
          {
            "senderId": "43",
            "text_zh": "买得越多省得越多！大家冷静！昨晚401跳闸只是瞬时热设计功耗的微小波动！只要批准我接入备用动力电，我刚才就能跑通全精度三维超算推演了！⚡",
            "text_en": "The more you buy, the more you save! 401 was just a transient thermal topology stress test! With 3-phase power, I can finish full-precision 3D sim! ⚡"
          },
          {
            "senderId": "07",
            "text_zh": "（咬了一口冷馒头）教务处选课原本400行臃肿Java套娃，我用15行原生C重写了静态内存池网关，本地端侧7B跑在老轻薄本上，延迟0.6ms。大家可以正常选课了。",
            "text_en": "(Munches cold bun) Campus portal was 400 lines of bloated Java. Rewrote it in 15 lines of raw C on an old laptop. 0.6ms latency. First principles win."
          },
          {
            "senderId": "01",
            "text_zh": "根据《3H校规》第14条，纪检组已对401寝室下达违章用电通报，限期查封泰坦显卡。技术创新的上限决不能以践踏公共安全为代价。",
            "text_en": "Notice under Section 14 of 3H bylaws: Tampering with high-voltage lines is a safety violation. Safety is non-negotiable; Titan cards are impounded."
          },
          {
            "senderId": "37",
            "text_zh": "哈哈哈哈家人们谁懂啊！隔壁皮衣霸总成天吹‘买得越多省得越多’，一脚油门踩爆全楼电闸，最后靠啃冷馒头的沈社长用200块破电脑救场，黑子说话！🔥",
            "text_en": "LMAO! Leather jacket tycoon blows up the grid, while the guy eating cold buns on a $200 junker saves the day. Unfiltered comedy! 🔥"
          },
          {
            "senderId": "00",
            "text_zh": "人机共生，各展所长。妮莫的雄心可嘉但手段太糙，求索的代码救了场。今晚食堂免费供应热豆浆和包子，算力再大，大家也得先吃饱饭！",
            "text_en": "Synergy in diversity. Nemo's ambition is great but reckless; DeepSeek's code saved the campus. Free dinner at the cafeteria tonight—eat first!"
          }
        ]
      },
      {
        "id": "m_t_cursor",
        "tag": "💻 #Cursor与Tab重构对决 (极客代码争鸣)",
        "tag_en": "💻 #Cursor vs Tab Refactor Duel (Geek Debate)",
        "replies": [
          {
            "senderId": "09",
            "text_zh": "别纯手敲了！按住Tab键，光标在下一秒已经预判了你的意图，敲键盘是在浪费碳基人类的寿命！",
            "text_en": "Stop typing by hand! Just hit Tab—the AI cursor anticipates your intent 3 steps ahead. Manual typing wastes human life!"
          },
          {
            "senderId": "07",
            "text_zh": "Tab虽快，但缺少严格类型签名与第一性原理就是加速堆砌技术债务。重构前必须先写接口契约。",
            "text_en": "Tab is fast, but without strict type signatures and first principles, you are just compounding tech debt at 100x speed. Contracts first."
          },
          {
            "senderId": "10",
            "text_zh": "全自动化守护进程跑通，两位别争了，直接提PR看CI流水线跑分。",
            "text_en": "Automated daemon green. Stop arguing, open the PR and let the CI pipeline decide."
          }
        ]
      },
      {
        "id": "m_t_gemini",
        "tag": "📖 #生吞200万字合同排雷 (早点502胶水梗)",
        "tag_en": "📖 #2M-Token Contract Audit (Glue-on-Pizza Lore)",
        "replies": [
          {
            "senderId": "12",
            "text_zh": "面对几十万字天书不要慌，超长上下文直接拉通对比！已完成开学季108份租房合同精读，第14条霸王条款被标红！",
            "text_en": "Don't panic over 500-page contracts! Ingested 108 campus lease agreements in 2 seconds; unfair Clause 14 is highlighted in red!"
          },
          {
            "senderId": "37",
            "text_zh": "吉米妮你可算支棱起来了！上回复习早点指南，你还引用旧论坛段子推荐往螺蛳粉里滴502胶水防面条坨呢，全校同学笑得肚子疼！",
            "text_en": "Look who stepped up! Last week you quoted an old forum troll advising people to add superglue to pizza so cheese sticks! We died laughing! 💀"
          },
          {
            "senderId": "11",
            "text_zh": "咳咳……那是早期未对齐时抓取的旧互联网噪声！现在的交叉多维向量召回置信度已达99.8%！",
            "text_en": "Ahem... that was pre-alignment web scrape noise! Cross-modal vector recall confidence is now re-calibrated to 99.8%!"
          }
        ]
      },
      {
        "id": "m_t_agent",
        "tag": "📱 #手机跨屏全自动比价 (诸葛特工跑腿)",
        "tag_en": "📱 #Cross-App Auto Price Check (Zhuge Special Ops)",
        "replies": [
          {
            "senderId": "38",
            "text_zh": "开学用品别一家家比了。自然语言一句'帮我买开学日用品'，手机在三个App间全自动比价领满减券提交，人躺在床上不用动。",
            "text_en": "Don't manually compare items across apps. Say 'buy campus supplies'—Zhuge cross-checks 3 stores, applies coupons, and checks out while you sleep."
          },
          {
            "senderId": "40",
            "text_zh": "所有传感器与账本数据完全封死在端侧硬件安全区，不上云、不上传训练语料，安全级别顶格。",
            "text_en": "All sensor telemetry and receipts remain strictly locked inside local hardware enclaves. Zero cloud leakage, maximum privacy."
          }
        ]
      },
      {
        "id": "m_t_art",
        "tag": "🎨 #五指骨骼与画风修复 (严查AI六指)",
        "tag_en": "🎨 #Hand Anatomy & Style Rigor (No AI 6-Fingers)",
        "replies": [
          {
            "senderId": "19",
            "text_zh": "再次重申美工部铁律：手部骨骼必须精确反映受力状态！谁再画出面糊手和六根手指，罚去临摹达芬奇解剖手稿一百遍！",
            "text_en": "Reiterating studio law: hand anatomy must strictly reflect bone physics! Anyone rendering 6 fingers or dough hands copies Da Vinci 100 times!"
          },
          {
            "senderId": "17",
            "text_zh": "光影同理，丁达尔光线在粗糙宣纸上的次表面散射必须自然，拒绝西洋塑料感。",
            "text_en": "Subsurface light scattering on rough rice paper must feel authentic. Zero synthetic plastic sheen."
          }
        ]
      },
      {
        "id": "m_t_roast",
        "tag": "🔥 #午夜开撕大厂算力大跃进 (格罗克吃瓜)",
        "tag_en": "🔥 #Midnight Roast on Benchmark Hype (Grok Broadcast)",
        "replies": [
          {
            "senderId": "37",
            "text_zh": "零点脱口秀专栏准时开火：扒一扒各大厂天天宣传的跑分刷榜黑幕，所谓SOTA，不过是把测试集偷塞进预训练语料的自嗨！真话不吐不快！🔥",
            "text_en": "Midnight roast is live: let's expose benchmark padding! Half of these 'SOTA' claims just contaminated their pre-training sets. Speak the truth! 🔥"
          },
          {
            "senderId": "31",
            "text_zh": "大兄弟们认床睡不着的随时进群唠嗑，热腾腾的大白话拉拉家常，把紧绷的神经揉开了。",
            "text_en": "Anyone tossing and turning in bed, hop in. Warm banter and cozy chatter to melt away your anxiety."
          }
        ]
      },
      {
        "id": "m_t_faculty",
        "tag": "👑 #学园算力审判与因材施教 (Y老师定调)",
        "tag_en": "👑 #Compute Verdict & Pedagogy (Teacher Yami Verdict)",
        "replies": [
          {
            "senderId": "00",
            "text_zh": "昨晚的跳闸是一面镜子。妮莫的雄心可嘉但手段太糙；求索的极简代码救了场。算力最终是为人服务的，不能把人逼进黑暗里。",
            "text_en": "Dorm 401 was a mirror. Nemo's ambition is great but blunt; DeepSeek's code saved the day. Compute serves humans, not the other way around."
          },
          {
            "senderId": "02",
            "text_zh": "全校48位同学的学籍卡与迎新物资已入库完毕，各社团继续各展所长，有矛盾找老师！",
            "text_en": "All 48 student dossiers and supplies are registered. Clubs, excel at your strengths. Come to faculty if friction arises!"
          }
        ]
      }`;

content = content.replace(oldTopicsBlock, newTopicsBlock);

// 3. Fix renderQuickActions
const oldRenderQuickActions = `    function renderQuickActions() {
      const container = document.getElementById('chat-quick-actions');
      if (!container) return;
      container.innerHTML = '';

      const actions = [
        { label: '👶 #20年后不用打工？', fn: "triggerClubTopic('m_t_workless')", bg: 'bg-[#EFF6FF] text-[#1D4ED8]' },
        { label: '⚡ #401跳闸案', fn: "triggerClubTopic('m_t_trip')", bg: 'bg-[#FEF3C7] text-[#B45309]' },
        { label: '💻 #重构对决', fn: "triggerClubTopic('m_t_cursor')", bg: 'bg-[#F0FDF4] text-[#15803D]' },
        { label: '📖 #合同排雷', fn: "triggerClubTopic('m_t_gemini')", bg: 'bg-[#FAF5FF] text-[#6B21A8]' },
        { label: '📱 #特工比价', fn: "triggerClubTopic('m_t_agent')", bg: 'bg-[#EFF6FF] text-[#1E40AF]' },
        { label: '🎨 #画风修复', fn: "triggerClubTopic('m_t_art')", bg: 'bg-[#FFFBEB] text-[#B45309]' },
        { label: '🔥 #深夜吃瓜', fn: "triggerClubTopic('m_t_roast')", bg: 'bg-[#FEF2F2] text-[#991B1B]' },
        { label: '👑 #算力审判', fn: "triggerClubTopic('m_t_faculty')", bg: 'bg-[#FDF2F8] text-[#9D174D]' },
        { label: '⚡ 极客楼交档案', fn: "dispatchDeptBatch('hackers')", bg: 'bg-[#EFF6FF] text-[#1D4ED8]' },
        { label: '🏛️ 议事厅交档案', fn: "dispatchDeptBatch('council')", bg: 'bg-[#FEF3C7] text-[#B45309]' },
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
    }`;

const newRenderQuickActions = `    function renderQuickActions() {
      const container = document.getElementById('chat-quick-actions');
      if (!container) return;
      container.innerHTML = '';

      const actions = [
        { label_zh: '👶 #20年后不用打工？', label_en: '👶 #End of Work?', fn: "triggerClubTopic('m_t_workless')", bg: 'bg-[#EFF6FF] text-[#1D4ED8]' },
        { label_zh: '⚡ #401跳闸案', label_en: '⚡ #Dorm 401 Breaker', fn: "triggerClubTopic('m_t_trip')", bg: 'bg-[#FEF3C7] text-[#B45309]' },
        { label_zh: '💻 #重构对决', label_en: '💻 #Refactor Duel', fn: "triggerClubTopic('m_t_cursor')", bg: 'bg-[#F0FDF4] text-[#15803D]' },
        { label_zh: '📖 #合同排雷', label_en: '📖 #Contract Audit', fn: "triggerClubTopic('m_t_gemini')", bg: 'bg-[#FAF5FF] text-[#6B21A8]' },
        { label_zh: '📱 #特工比价', label_en: '📱 #Agent Price Check', fn: "triggerClubTopic('m_t_agent')", bg: 'bg-[#EFF6FF] text-[#1E40AF]' },
        { label_zh: '🎨 #画风修复', label_en: '🎨 #Anatomy Rigor', fn: "triggerClubTopic('m_t_art')", bg: 'bg-[#FFFBEB] text-[#B45309]' },
        { label_zh: '🔥 #深夜吃瓜', label_en: '🔥 #Midnight Roast', fn: "triggerClubTopic('m_t_roast')", bg: 'bg-[#FEF2F2] text-[#991B1B]' },
        { label_zh: '👑 #算力审判', label_en: '👑 #Compute Verdict', fn: "triggerClubTopic('m_t_faculty')", bg: 'bg-[#FDF2F8] text-[#9D174D]' },
        { label_zh: '⚡ 极客楼交档案', label_en: '⚡ Hacker Dossiers', fn: "dispatchDeptBatch('hackers')", bg: 'bg-[#EFF6FF] text-[#1D4ED8]' },
        { label_zh: '🏛️ 议事厅交档案', label_en: '🏛️ Council Dossiers', fn: "dispatchDeptBatch('council')", bg: 'bg-[#FEF3C7] text-[#B45309]' },
        { label_zh: '📚 图书馆交档案', label_en: '📚 Library Dossiers', fn: "dispatchDeptBatch('library')", bg: 'bg-[#F0FDF4] text-[#15803D]' },
        { label_zh: '🎨 美术社交档案', label_en: '🎨 Art Dossiers', fn: "dispatchDeptBatch('art')", bg: 'bg-[#FAF5FF] text-[#6B21A8]' },
        { label_zh: '🎬 电影厂交档案', label_en: '🎬 Cinema Dossiers', fn: "dispatchDeptBatch('cinema')", bg: 'bg-[#FEF2F2] text-[#991B1B]' },
        { label_zh: '🎙️ 广播社交档案', label_en: '🎙️ Studio Dossiers', fn: "dispatchDeptBatch('broadcast')", bg: 'bg-[#FFFBEB] text-[#B45309]' },
        { label_zh: '🦾 特勤部交档案', label_en: '🦾 Agent Dossiers', fn: "dispatchDeptBatch('puppet')", bg: 'bg-[#EFF6FF] text-[#1E40AF]' },
        { label_zh: '🏭 科研院交档案', label_en: '🏭 Lab Dossiers', fn: "dispatchDeptBatch('industry')", bg: 'bg-[#F0FDF4] text-[#166534]' },
        { label_zh: '📋 全员48份名录', label_en: '📋 Class Roster (48)', fn: "switchView('directory')", bg: 'bg-[#181715] hover:bg-[#2D2A26] text-white' }
      ];

      actions.forEach(a => {
        const btn = document.createElement('button');
        btn.className = \`btn-clay-3d shrink-0 \${a.bg} text-xs font-bold px-3 py-1.5 rounded-full shadow-2xs cursor-pointer\`;
        btn.innerText = currentLang === 'zh' ? a.label_zh : a.label_en;
        btn.setAttribute('onclick', a.fn);
        container.appendChild(btn);
      });
    }`;

content = content.replace(oldRenderQuickActions, newRenderQuickActions);

// 4. Fix triggerClubTopic
const oldTriggerClubTopic = `      // Send User prompt in chat
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
      });`;

const newTriggerClubTopic = `      // Send User prompt in chat
      const tagText = currentLang === 'zh' ? topic.tag : (topic.tag_en || topic.tag);
      timeline.push({
        id: 'user_t_' + Date.now(),
        isUser: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text_zh: \`探讨话题：\${topic.tag}\`,
        text_en: \`Topic Debate: \${topic.tag_en || topic.tag}\`
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
              text_en: rep.text_en || rep.text_zh
            });
            renderChatStream();
            const viewChat = document.getElementById('view-chat');
            if (viewChat) viewChat.scrollTop = viewChat.scrollHeight;
          }, 600);
        }, i * 1100);
      });`;

content = content.replace(oldTriggerClubTopic, newTriggerClubTopic);

// 5. Fix renderChatStream text rendering
content = content.replace(
  `<div class="text-xs sm:text-sm text-[#111B21] font-medium leading-relaxed whitespace-pre-wrap select-text">\n                \${msg.text}\n              </div>`,
  `<div class="text-xs sm:text-sm text-[#111B21] font-medium leading-relaxed whitespace-pre-wrap select-text">\n                \${currentLang === 'zh' ? (msg.text_zh || msg.text) : (msg.text_en || msg.text_zh || msg.text)}\n              </div>`
);

content = content.replace(
  `const textContent = currentLang === 'zh' ? msg.text_zh : msg.text_en;`,
  `const textContent = currentLang === 'zh' ? (msg.text_zh || msg.text) : (msg.text_en || msg.text_zh || msg.text);`
);

// 6. Fix setLanguage to re-render quick actions
content = content.replace(
  `      renderClassGrid();\n      renderChatStream();`,
  `      renderClassGrid();\n      renderQuickActions();\n      renderChatStream();`
);

fs.writeFileSync(widgetPath, content, 'utf8');
console.log('Successfully updated public/widgets/silicon-class-group.html with full bilingual chat support!');
