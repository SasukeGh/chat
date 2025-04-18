const { Client } = require('pg');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { sender, message } = req.body;

  if (!sender || !message) return res.status(400).json({ error: 'Missing sender or message' });

  const client = new Client({
    connectionString: process.env.PG_CONN_STRING,
  });

  try {
    await client.connect();
    await client.query(
      'INSERT INTO messages (sender, message) VALUES ($1, $2)',
      [sender, message]
    );
    await client.end();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error in sendMessage:', err); // 💥
    res.status(500).json({ error: err.message });
  }
};
