// scripts/sync-widget-channels.cjs
const fs = require('fs');
const path = require('path');

const widgetPath = path.join(__dirname, '../public/widgets/silicon-class-group.html');
const chatDataPath = path.join(__dirname, '../src/data/academy-clubs-chat.json');

let widgetHtml = fs.readFileSync(widgetPath, 'utf-8');
const chatData = JSON.parse(fs.readFileSync(chatDataPath, 'utf-8'));

const startIndex = widgetHtml.indexOf('const clubChannels = [');
const endIndex = widgetHtml.indexOf('const channelTimelines = {');

if (startIndex !== -1 && endIndex !== -1) {
  const newChannelsCode = `const clubChannels = ${JSON.stringify(chatData.channels, null, 2)};\n\n    `;
  widgetHtml = widgetHtml.slice(0, startIndex) + newChannelsCode + widgetHtml.slice(endIndex);
  fs.writeFileSync(widgetPath, widgetHtml, 'utf-8');
  console.log('Successfully synced clubChannels into public/widgets/silicon-class-group.html!');
} else {
  console.error('Could not find markers for clubChannels in widget html');
  process.exit(1);
}
