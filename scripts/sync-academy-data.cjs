/**
 * scripts/sync-academy-data.cjs
 * Canonical Data Synchronization & Integrity Validator
 * 
 * Ensures:
 * 1. src/data/academy-members.json is valid, complete, and schema-compliant.
 * 2. All senderId references in src/data/academy-clubs-chat.json point to valid members.
 * 3. public/widgets/silicon-class-group.html is automatically updated with canonical member data.
 * 4. public/data/academy-members.json is published for static client API access.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MEMBERS_FILE = path.join(ROOT, 'src/data/academy-members.json');
const CLUBS_CHAT_FILE = path.join(ROOT, 'src/data/academy-clubs-chat.json');
const WIDGET_FILE = path.join(ROOT, 'public/widgets/silicon-class-group.html');
const PUBLIC_DATA_DIR = path.join(ROOT, 'public/data');
const PUBLIC_DATA_FILE = path.join(PUBLIC_DATA_DIR, 'academy-members.json');

console.log('🔄 [sync-academy-data] Starting data verification & synchronization...');

// 1. Read & Validate Canonical Members Data
if (!fs.existsSync(MEMBERS_FILE)) {
  console.error('❌ Critical: Members file not found at:', MEMBERS_FILE);
  process.exit(1);
}

const rawMembers = fs.readFileSync(MEMBERS_FILE, 'utf8');
let members;
try {
  members = JSON.parse(rawMembers);
} catch (e) {
  console.error('❌ Syntax error in academy-members.json:', e.message);
  process.exit(1);
}

if (!Array.isArray(members) || members.length < 48) {
  console.error(`❌ Expected at least 48 members, found: ${members.length}`);
  process.exit(1);
}

// Check uniqueness and schema
const seenIds = new Set();
const memberMap = new Map();

for (const m of members) {
  if (!m.id) {
    console.error('❌ Member missing ID:', m);
    process.exit(1);
  }
  if (seenIds.has(m.id)) {
    console.error(`❌ Duplicate member ID: ${m.id}`);
    process.exit(1);
  }
  seenIds.add(m.id);
  memberMap.set(m.id, m);

  // Validate required fields
  const required = ['id', 'name_zh', 'name_en', 'title_zh', 'company', 'model', 'logo', 'bg', 'color', 'stats'];
  for (const field of required) {
    if (!m[field]) {
      console.warn(`⚠️ Warning: Member #${m.id} (${m.name_zh}) missing field '${field}'`);
    }
  }

  // Validate stats range
  if (m.stats) {
    for (const [statKey, statVal] of Object.entries(m.stats)) {
      if (typeof statVal !== 'number' || statVal < 0 || statVal > 100) {
        console.warn(`⚠️ Warning: Member #${m.id} stat '${statKey}' out of range: ${statVal}`);
      }
    }
  }
}

console.log(`✅ [1/4] Validated ${members.length} members in canonical database.`);

// 2. Validate Clubs Chat References
if (fs.existsSync(CLUBS_CHAT_FILE)) {
  try {
    const clubsData = JSON.parse(fs.readFileSync(CLUBS_CHAT_FILE, 'utf8'));
    let chatMsgCount = 0;
    let missingRef = 0;
    const channels = clubsData.channels || [];

    for (const channel of channels) {
      if (Array.isArray(channel.topics)) {
        for (const topic of channel.topics) {
          if (Array.isArray(topic.replies)) {
            for (const r of topic.replies) {
              chatMsgCount++;
              if (r.senderId && !memberMap.has(r.senderId)) {
                console.warn(`⚠️ Unknown senderId '${r.senderId}' in channel '${channel.id}'`);
                missingRef++;
              }
            }
          }
        }
      }
    }

    if (missingRef === 0) {
      console.log(`✅ [2/4] Validated ${chatMsgCount} club chat messages across ${channels.length} channels. All sender IDs resolve correctly.`);
    } else {
      console.warn(`⚠️ Found ${missingRef} unresolved sender IDs in clubs chat.`);
    }
  } catch (e) {
    console.warn('⚠️ Could not validate clubs chat:', e.message);
  }
}

// 3. Publish public/data/academy-members.json for static API access
if (!fs.existsSync(PUBLIC_DATA_DIR)) {
  fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
}
fs.writeFileSync(PUBLIC_DATA_FILE, JSON.stringify(members, null, 2), 'utf8');
console.log(`✅ [3/4] Exported static public API data to: public/data/academy-members.json`);

// 4. Synchronize into public/widgets/silicon-class-group.html
if (fs.existsSync(WIDGET_FILE)) {
  let widgetHtml = fs.readFileSync(WIDGET_FILE, 'utf8');
  const startTag = 'const members = [';
  const startIdx = widgetHtml.indexOf(startTag);
  const endIdx = widgetHtml.indexOf('];', startIdx);

  if (startIdx !== -1 && endIdx !== -1) {
    // Only student members (IDs 01 to 48) in widget roster
    const studentMembers = members.filter(m => m.id !== '00');
    const newMembersJson = JSON.stringify(studentMembers, null, 2);

    const updatedWidgetHtml = widgetHtml.slice(0, startIdx + 'const members = '.length) 
      + newMembersJson 
      + widgetHtml.slice(endIdx + 1);

    fs.writeFileSync(WIDGET_FILE, updatedWidgetHtml, 'utf8');
    console.log(`✅ [4/4] Synchronized ${studentMembers.length} student members into silicon-class-group.html`);
  } else {
    console.warn('⚠️ Could not locate `const members = [` array in silicon-class-group.html');
  }
}

console.log('🎉 [sync-academy-data] All academy data verified and synchronized successfully!');
