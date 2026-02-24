import { kv } from '@vercel/kv';
import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { password, data } = req.body;
  if (!password || !data) return res.status(400).json({ error: 'missing fields' });

  const key = 'jp_' + crypto.createHash('sha256').update(password).digest('hex').slice(0, 16);
  await kv.set(key, JSON.stringify(data));
  return res.json({ ok: true });
}
