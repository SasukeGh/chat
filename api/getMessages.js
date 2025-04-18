const { Client } = require('pg');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const client = new Client({
    connectionString: process.env.PG_CONN_STRING,
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM messages ORDER BY timestamp ASC');
    await client.end();
    res.status(200).json({ messages: result.rows });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: err.message });
  }
};
