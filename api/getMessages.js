const { Client } = require('pg');
import { Client } from 'pg';

export default async function handler(req, res) {
  const client = new Client({ connectionString: process.env.PG_CONN_STRING });
  await client.connect();

  const result = await client.query('SELECT sender, message FROM messages ORDER BY created_at ASC');
  await client.end();

  res.status(200).json({ messages: result.rows });
}

