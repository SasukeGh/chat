import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { sender, message } = req.body;
  if (!sender || !message) return res.status(400).json({ error: 'Missing fields' });

  const client = new Client({ connectionString: process.env.PG_CONN_STRING });
  await client.connect();

  await client.query('INSERT INTO messages (sender, message) VALUES ($1, $2)', [sender, message]);
  await client.end();

  res.status(200).json({ success: true });
}

