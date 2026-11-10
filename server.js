require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT || 3000);
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIP_CHANNEL_ID = process.env.CLIP_CHANNEL_ID;
const ADMIN_DISCORD_USER_ID = process.env.ADMIN_DISCORD_USER_ID;
const DATA_FILE = path.join(__dirname, 'clips.json');
const PUBLIC_DIR = __dirname;

if (!DISCORD_TOKEN || !CLIP_CHANNEL_ID || !ADMIN_DISCORD_USER_ID) {
  console.error('Brak DISCORD_TOKEN, CLIP_CHANNEL_ID lub ADMIN_DISCORD_USER_ID w pliku .env');
  process.exit(1);
}

function readClips() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}
function writeClips(clips) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(clips, null, 2), 'utf8');
}

// Accept both common Medal share URL formats, including /games/.../clips/<id>.
function getMedalLinks(content) {
  const found = content.match(/https?:\/\/(?:www\.)?medal\.tv\/[^\s<>()]+/gi) || [];
  const valid = [];
  for (const raw of found) {
    try {
      const url = new URL(raw.replace(/[),.!?]+$/, ''));
      if (!/(^|\.)medal\.tv$/i.test(url.hostname)) continue;
      const pathMatch = url.pathname.match(/\/(?:games\/[^/]+\/)?clips?\/([A-Za-z0-9_-]+)/i);
      if (!pathMatch) continue;
      const id = pathMatch[1];
      // Medal's share URLs vary; retain the full original path/query for the embed.
      const embed = new URL(url.toString());
      embed.searchParams.set('embed', '1');
      valid.push({ id, url: url.toString(), embedUrl: embed.toString() });
    } catch (_) {}
  }
  return [...new Map(valid.map(item => [item.id, item])).values()];
}

const app = express();
app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));
app.get('/api/clips', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json(readClips());
});
app.get('/health', (_req, res) => res.json({ ok: true }));
app.listen(PORT, () => console.log(`FATALITY website/API listening on port ${PORT}`));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel]
});

client.once('ready', () => {
  console.log(`Discord bot logged in as ${client.user.tag}`);
  console.log(`Watching Discord channel ${CLIP_CHANNEL_ID}`);
});

client.on('messageCreate', message => {
  // TYLKO właściciel wskazany w ADMIN_DISCORD_USER_ID może publikować klipy.
  // Wiadomości innych osób są ignorowane, nawet jeśli są na właściwym kanale.
  if (message.author.bot || message.channelId !== CLIP_CHANNEL_ID) return;
  if (message.author.id !== ADMIN_DISCORD_USER_ID) {
    console.log(`Ignored clip submission from non-admin Discord user ${message.author.id}`);
    return;
  }
  const links = getMedalLinks(message.content);
  if (!links.length) return;

  const clips = readClips();
  let changed = false;
  for (const link of links) {
    if (clips.some(clip => clip.id === link.id)) continue;
    clips.unshift({
      ...link,
      discordMessageId: message.id,
      addedAt: new Date().toISOString(),
      author: message.member?.displayName || message.author.username
    });
    changed = true;
  }
  if (changed) {
    writeClips(clips);
    message.react('✅').catch(() => {});
    console.log(`Added ${links.length} Medal link(s) from ${message.author.tag}`);
  }
});

client.on('messageDelete', message => {
  if (message.channelId !== CLIP_CHANNEL_ID) return;
  const next = readClips().filter(clip => clip.discordMessageId !== message.id);
  writeClips(next);
});
client.on('messageDeleteBulk', messages => {
  const ids = new Set(messages.map(message => message.id));
  const next = readClips().filter(clip => !ids.has(clip.discordMessageId));
  writeClips(next);
});

client.login(DISCORD_TOKEN);
