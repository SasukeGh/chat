const { Client } = require('pg');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { sender, message } = req.body;

  if (!sender || !message) {
    return res.status(400).json({ error: 'Sender and message are required' });
  }

  const client = new Client({
    connectionString: process.env.PG_CONN_STRING,
  });

  try {
    await client.connect();
    await client.query(
      'INSERT INTO messages (sender, message, timestamp) VALUES ($1, $2, NOW())',
      [sender, message]
    );
    await client.end();
    res.status(200).json({ success: 'Message sent successfully' });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: err.message });
  }
};
